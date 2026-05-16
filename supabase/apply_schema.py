"""
Apply supabase/plants_schema.sql to the Supabase Postgres
using DATABASE_URL from bridge/.env.

Run:
    bridge/venv/Scripts/python.exe supabase/apply_schema.py
"""
import os
import sys
from pathlib import Path

import psycopg2
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / "bridge" / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in bridge/.env", file=sys.stderr)
    sys.exit(1)

sql_files = sorted((ROOT / "supabase").glob("*_schema.sql"))
if not sql_files:
    print("ERROR: no *_schema.sql found in supabase/", file=sys.stderr)
    sys.exit(1)

print(f"Connecting to Postgres ...")
conn = psycopg2.connect(DATABASE_URL)
conn.autocommit = True
try:
    with conn.cursor() as cur:
        for sql_path in sql_files:
            print(f"Applying {sql_path.name} ...")
            cur.execute(sql_path.read_text(encoding="utf-8"))

        # verify all tables
        for table in ("plants", "garden_items", "greenhouses", "plots", "care_actions"):
            cur.execute(
                "SELECT column_name, data_type FROM information_schema.columns "
                "WHERE table_schema = 'public' AND table_name = %s "
                "ORDER BY ordinal_position;",
                (table,),
            )
            cols = cur.fetchall()
            if cols:
                print(f"OK. public.{table} columns:")
                for name, dtype in cols:
                    print(f"  - {name}: {dtype}")
            else:
                print(f"WARNING: public.{table} not found")
finally:
    conn.close()
