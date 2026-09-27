export const SCHEMA = [
  'CREATE TABLE IF NOT EXISTS todos (',
  '  id INTEGER PRIMARY KEY,',
  '  title TEXT NOT NULL,',
  '  due INTEGER,',
  '  done INTEGER NOT NULL DEFAULT 0',
  ')',
].join('\n')
