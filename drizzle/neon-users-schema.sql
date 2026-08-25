-- THE ARZENS Vercel dashboard: isolated Neon PostgreSQL users schema.
-- Apply this only to the `thearzens-owner-dashboard` Neon project.

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  open_id VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  login_method VARCHAR(64),
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_signed_in TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
