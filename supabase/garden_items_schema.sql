-- ===== ตาราง garden_items: เก็บกระถาง/แปลง/ของตกแต่งที่ผู้ใช้วางในสวน 3D =====
-- รันได้หลายครั้ง (idempotent) — ผ่าน supabase/apply_schema.py

CREATE TABLE IF NOT EXISTS public.garden_items (
  id           TEXT PRIMARY KEY,           -- เช่น "item_1700000000_a4f"
  username     TEXT NOT NULL,
  type         TEXT NOT NULL,              -- 'pot' | 'bed' | 'deco'
  "plantId"    INTEGER,                    -- id ใน PLANT_CATALOG / DECO_CATALOG (nullable ตอนยังไม่เลือกพืช)
  "gridX"      INTEGER NOT NULL,
  "gridZ"      INTEGER NOT NULL,
  "plotId"     TEXT NOT NULL,              -- ผูกกับ public.plants.id ของ user (string)
  name         TEXT,
  zone         TEXT,
  health       INTEGER,
  "plantedAt"  TEXT,
  "deviceId"   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS garden_items_user_idx ON public.garden_items (username);
CREATE INDEX IF NOT EXISTS garden_items_plot_idx ON public.garden_items (username, "plotId");

ALTER TABLE public.garden_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "garden_items_anon_all" ON public.garden_items;
CREATE POLICY "garden_items_anon_all" ON public.garden_items
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
