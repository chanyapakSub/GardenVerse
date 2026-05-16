-- ===== ตาราง care_actions: บันทึกการรดน้ำ/ให้ปุ๋ย/บันทึกอื่น ๆ =====

CREATE TABLE IF NOT EXISTS public.care_actions (
  id            BIGSERIAL PRIMARY KEY,
  username      TEXT NOT NULL,
  "itemId"      TEXT,                       -- garden_items.id ของกระถาง/แปลง (NULL ได้)
  action        TEXT NOT NULL,              -- 'water' | 'fertilize' | 'note' | ...
  detail        TEXT,
  "performedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS care_actions_user_idx ON public.care_actions (username, "performedAt" DESC);
CREATE INDEX IF NOT EXISTS care_actions_item_idx ON public.care_actions ("itemId", "performedAt" DESC);

ALTER TABLE public.care_actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "care_actions_anon_all" ON public.care_actions;
CREATE POLICY "care_actions_anon_all" ON public.care_actions
  FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

NOTIFY pgrst, 'reload schema';
