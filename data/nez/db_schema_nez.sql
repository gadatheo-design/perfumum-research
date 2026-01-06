-- PER FUMUM — minimal schema for NEZ research axes (Postgres)

CREATE TABLE IF NOT EXISTS research_axis (
  axis_id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  novelty_tagline TEXT,
  description_fr TEXT,
  description_en TEXT,
  ui_module TEXT,
  core_entities TEXT,
  kpis TEXT,
  default_filters_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS source_article (
  source_id TEXT PRIMARY KEY,
  url TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  lang TEXT CHECK (lang IN ('fr','en')) NOT NULL,
  published_at DATE,
  author TEXT,
  categories TEXT,
  themes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS axis_source (
  axis_id TEXT NOT NULL REFERENCES research_axis(axis_id) ON DELETE CASCADE,
  source_id TEXT NOT NULL REFERENCES source_article(source_id) ON DELETE CASCADE,
  confidence REAL NOT NULL DEFAULT 0.5 CHECK (confidence >= 0 AND confidence <= 1),
  evidence TEXT,
  PRIMARY KEY (axis_id, source_id)
);
