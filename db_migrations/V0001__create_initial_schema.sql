CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  played INTEGER DEFAULT 0,
  won INTEGER DEFAULT 0,
  drawn INTEGER DEFAULT 0,
  lost INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  form TEXT DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL REFERENCES teams(id),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  matches INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_score INTEGER,
  away_score INTEGER,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO teams (id, name, played, won, drawn, lost, goals_for, goals_against, points, form) VALUES
  ('1', 'ФК ТОРПЕДО', 0, 0, 0, 0, 0, 0, 0, '[]'),
  ('2', 'ФУ НАГЛЕЦЫ ИЗ ВОРОНЕЖА', 0, 0, 0, 0, 0, 0, 0, '[]'),
  ('3', 'ФК UNION', 0, 0, 0, 0, 0, 0, 0, '[]'),
  ('4', 'ФК САБОТАЖ', 0, 0, 0, 0, 0, 0, 0, '[]'),
  ('5', 'ФК ПРИДОН', 0, 0, 0, 0, 0, 0, 0, '[]'),
  ('6', 'ФК МУХТАР', 0, 0, 0, 0, 0, 0, 0, '[]')
ON CONFLICT (id) DO NOTHING;