-- ===== ตาราง greenhouses + plots =====
-- ผู้ใช้สร้างโรงเรือน/แปลงเองและตั้งชื่อเอง (ไม่ผูกกับ public.plants)
-- รันได้หลายครั้ง (idempotent)

CREATE TABLE IF NOT EXISTS public.greenhouses (
  id          TEXT PRIMARY KEY,           -- 'gh_<timestamp>_<rand>'
  username    TEXT NOT NULL,
  name        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.plots (
  id              TEXT PRIMARY KEY,        -- 'plot_<timestamp>_<rand>'
  username        TEXT NOT NULL,
  "greenhouseId"  TEXT NOT NULL,
  name            TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS greenhouses_user_idx ON public.greenhouses (username);
CREATE INDEX IF NOT EXISTS plots_user_idx       ON public.plots (username);
CREATE INDEX IF NOT EXISTS plots_greenhouse_idx ON public.plots (username, "greenhouseId");

ALTER TABLE public.greenhouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plots       ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "greenhouses_anon_all" ON public.greenhouses;
CREATE POLICY "greenhouses_anon_all" ON public.greenhouses
  FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "plots_anon_all" ON public.plots;
CREATE POLICY "plots_anon_all" ON public.plots
  FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
