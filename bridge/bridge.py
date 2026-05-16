"""
Firebase RTDB → PostgreSQL Bridge
ฟัง Firebase /readings แล้ว insert ลง Supabase แบบ realtime
"""
import os
import time
import threading
import logging
from datetime import datetime, timezone

import firebase_admin
from firebase_admin import credentials, db
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

# Event ใช้ signal ให้ thread ลูกหยุด เวลา Ctrl+C
shutdown_event = threading.Event()

# Watchdog: ถ้า last_event_time ไม่อัปเดตนาน → ถือว่า listener ตาย แล้ว restart
last_event_time = 0.0
WATCHDOG_TIMEOUT = 90  # วินาที — Firebase ส่ง keep-alive ~30s, ถ้าหาย 90s = ผิดปกติ

# ===== Config =====
load_dotenv()
FIREBASE_DB_URL   = os.getenv("FIREBASE_DB_URL")
FIREBASE_KEY_PATH = os.getenv("FIREBASE_KEY_PATH")
DATABASE_URL      = os.getenv("DATABASE_URL")

# ===== Logging =====
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("bridge")


# ===== PostgreSQL =====
def get_pg_conn():
    """สร้าง connection ใหม่ทุกครั้งที่ insert (เผื่อ pooler ตัด idle)"""
    return psycopg2.connect(DATABASE_URL)


def insert_reading(conn, firebase_key: str, data: dict) -> bool:
    """Insert 1 record ลง PostgreSQL โดยใช้ Connection ที่ถูกส่งเข้ามา"""
    try:
        ts_ms = data.get("timestamp")
        if not ts_ms:
            log.warning(f"⚠️  {firebase_key}: ไม่มี timestamp, ข้าม")
            return False
        recorded_at = datetime.fromtimestamp(ts_ms / 1000, tz=timezone.utc)

        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO sensor_readings
                    (device_id, temperature, humidity, lux, recorded_at, firebase_key)
                VALUES (%s, %s, %s, %s, %s, %s)
                ON CONFLICT (firebase_key) DO NOTHING
                RETURNING id;
                """,
                (
                    data.get("device_id", "unknown"),
                    data.get("temperature"),
                    data.get("humidity"),
                    data.get("lux"),
                    recorded_at,
                    firebase_key,
                ),
            )
            result = cur.fetchone()
            return result is not None
    except Exception as e:
        log.error(f"❌ DB error for {firebase_key}: {e}")
        return False


def on_event(event):
    global last_event_time
    last_event_time = time.time()  # ใช้กับ watchdog

    if event.event_type == "keep-alive":
        return

    path = event.path        
    data = event.data        

    # --- กรณีที่ 1: Initial snapshot (ข้อมูลก้อนใหญ่) ---
    if path == "/":
        if data is None:
            log.info("📭 Firebase ว่าง — รอข้อมูลใหม่...")
            return
        log.info(f"📥 Initial snapshot: {len(data)} records — batch inserting...")

        rows = []
        skipped = 0
        for k, v in data.items():
            if not isinstance(v, dict):
                continue
            ts_ms = v.get("timestamp")
            if not ts_ms:
                skipped += 1
                continue
            rows.append((
                v.get("device_id", "unknown"),
                v.get("temperature"),
                v.get("humidity"),
                v.get("lux"),
                datetime.fromtimestamp(ts_ms / 1000, tz=timezone.utc),
                k,
            ))

        added = 0
        if rows:
            conn = get_pg_conn()
            try:
                with conn.cursor() as cur:
                    result = execute_values(
                        cur,
                        """
                        INSERT INTO sensor_readings
                            (device_id, temperature, humidity, lux, recorded_at, firebase_key)
                        VALUES %s
                        ON CONFLICT (firebase_key) DO NOTHING
                        RETURNING id;
                        """,
                        rows,
                        fetch=True,
                    )
                    added = len(result)
                conn.commit()
            except Exception as e:
                log.error(f"❌ Batch insert error: {e}")
            finally:
                conn.close()

        log.info(f"✅ Inserted {added}/{len(rows)} (duplicates: {len(rows)-added}, skipped: {skipped})")
        return

    # --- กรณีที่ 2: Event ปกติ (ข้อมูลมาทีละตัว) ---
    firebase_key = path.lstrip("/")
    if not isinstance(data, dict):
        return

    conn = get_pg_conn()
    try:
        if insert_reading(conn, firebase_key, data):
            conn.commit()
            lux = data.get('lux')
            lux_str = f"{lux:.1f}lx" if lux is not None else "-"
            log.info(
                f"✅ {firebase_key[:8]}... "
                f"T={data.get('temperature'):.2f}°C "
                f"H={data.get('humidity'):.2f}% "
                f"L={lux_str} "
                f"({data.get('device_id', 'unknown')})"
            )
        else:
            log.debug(f"⏭️  {firebase_key[:8]}... duplicate, ข้าม")
    finally:
        conn.close() # ปิด Connection เสมอ

# ===== Main =====
def main():
    # init Firebase
    cred = credentials.Certificate(FIREBASE_KEY_PATH)
    firebase_admin.initialize_app(cred, {"databaseURL": FIREBASE_DB_URL})
    log.info("🔥 Firebase connected")

    # ทดสอบ DB connection
    try:
        with get_pg_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT COUNT(*) FROM sensor_readings;")
                count = cur.fetchone()[0]
        log.info(f"🐘 PostgreSQL connected (existing rows: {count})")
    except Exception as e:
        log.error(f"❌ DB connection failed: {e}")
        return

    # ref.listen() เป็น non-blocking — return ListenerRegistration ทันที
    # SSE ทำงานใน thread ภายในของ firebase_admin เอง
    # main thread แค่ sleep + watchdog เพื่อให้ Ctrl+C ทำงานและ detect listener ตาย
    global last_event_time
    ref = db.reference("/readings")
    log.info("👂 Listening to /readings ... (Ctrl+C to stop)")
    registration = ref.listen(on_event)
    last_event_time = time.time()

    try:
        while not shutdown_event.is_set():
            time.sleep(1)
            # watchdog — ถ้าไม่มี event/keep-alive นานเกิน → restart listener
            silence = time.time() - last_event_time
            if silence > WATCHDOG_TIMEOUT:
                log.warning(
                    f"⚠️  ไม่มี event/keep-alive นาน {silence:.0f}s — restart listener"
                )
                try:
                    registration.close()
                except Exception:
                    pass
                registration = ref.listen(on_event)
                last_event_time = time.time()
    except KeyboardInterrupt:
        log.info("👋 Stopping...")
    finally:
        shutdown_event.set()
        try:
            registration.close()
        except Exception:
            pass


if __name__ == "__main__":
    main()