"""
Firebase RTDB → PostgreSQL Bridge
ฟัง Firebase /readings แล้ว insert ลง Supabase แบบ realtime
"""
import os
import logging
from datetime import datetime, timezone

import firebase_admin
from firebase_admin import credentials, db
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

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


def insert_reading(firebase_key: str, data: dict) -> bool:
    """Insert 1 record ลง PostgreSQL — return True ถ้าใส่ใหม่, False ถ้าซ้ำ"""
    try:
        # แปลง timestamp (epoch ms) → datetime
        ts_ms = data.get("timestamp")
        if not ts_ms:
            log.warning(f"⚠️  {firebase_key}: ไม่มี timestamp, ข้าม")
            return False
        recorded_at = datetime.fromtimestamp(ts_ms / 1000, tz=timezone.utc)

        with get_pg_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO sensor_readings
                        (device_id, temperature, humidity, recorded_at, firebase_key)
                    VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (firebase_key) DO NOTHING
                    RETURNING id;
                    """,
                    (
                        data.get("device_id", "unknown"),
                        data.get("temperature"),
                        data.get("humidity"),
                        recorded_at,
                        firebase_key,
                    ),
                )
                result = cur.fetchone()
                conn.commit()
                return result is not None
    except Exception as e:
        log.error(f"❌ DB error for {firebase_key}: {e}")
        return False


# ===== Firebase listener =====
def on_event(event):
    """
    Firebase ส่ง event 3 แบบ:
      - 'put'   : เพิ่ม/แก้ไข node
      - 'patch' : update บางส่วน
      - 'keep-alive' : ping จาก Firebase (ข้าม)
    """
    if event.event_type == "keep-alive":
        return

    path = event.path        # e.g. "/-Or95U98JvHA8fYjj5L5"
    data = event.data        # e.g. {"temperature": 28.22, ...}

    # ตอน listener เริ่มทำงานครั้งแรก จะได้ snapshot ของทั้ง /readings มาก้อนใหญ่
    # path จะเป็น "/" และ data เป็น dict ของหลาย records
    if path == "/":
        if data is None:
            log.info("📭 Firebase ว่าง — รอข้อมูลใหม่...")
            return
        log.info(f"📥 Initial snapshot: {len(data)} records")
        added = sum(1 for k, v in data.items() if isinstance(v, dict) and insert_reading(k, v))
        log.info(f"✅ Inserted {added}/{len(data)} (ที่เหลือเป็น duplicate)")
        return

    # event ปกติ: path = "/<firebase_key>", data = full record
    firebase_key = path.lstrip("/")
    if not isinstance(data, dict):
        return

    if insert_reading(firebase_key, data):
        log.info(
            f"✅ {firebase_key[:8]}... "
            f"T={data.get('temperature'):.2f}°C "
            f"H={data.get('humidity'):.2f}%"
        )
    else:
        log.debug(f"⏭️  {firebase_key[:8]}... duplicate, ข้าม")


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

    # เริ่ม listen
    log.info("👂 Listening to /readings ... (Ctrl+C to stop)")
    ref = db.reference("/readings")
    ref.listen(on_event)  # blocking — รันยาวจนกว่าจะ Ctrl+C


if __name__ == "__main__":
    main()