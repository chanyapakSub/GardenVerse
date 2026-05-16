-- ===== ตาราง plants สำหรับเก็บพืชของผู้ใช้แต่ละคน =====
-- รันใน Supabase SQL Editor หรือผ่าน psql ด้วย DATABASE_URL

CREATE TABLE IF NOT EXISTS public.plants (
  id           BIGSERIAL PRIMARY KEY,
  username     TEXT NOT NULL,
  name         TEXT NOT NULL,
  "sciName"    TEXT,
  status       TEXT DEFAULT 'สุขภาพดี',
  "statusColor" TEXT DEFAULT 'bg-green-50 text-green-600 border-green-200',
  age          TEXT,
  planted      TEXT,
  water        TEXT DEFAULT '100%',
  image        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS plants_username_idx ON public.plants (username);

-- เปิด RLS แต่อนุญาตให้ anon (publishable key) ทำได้ทุกอย่าง
-- (โปรเจกต์นี้ยังไม่ได้ใช้ Supabase Auth — auth ของแอปเก็บใน localStorage แทน)
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plants_anon_all" ON public.plants;
CREATE POLICY "plants_anon_all" ON public.plants
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- บอก PostgREST ให้ reload schema cache (กัน error PGRST205)
NOTIFY pgrst, 'reload schema';
