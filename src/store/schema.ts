/** The schema after every migration: for reading, not for creating tables. */
export const SCHEMA = [
  'CREATE TABLE todos (',
  '  id INTEGER PRIMARY KEY,',
  '  title TEXT NOT NULL,',
  '  due_at INTEGER,',
  '  done INTEGER NOT NULL DEFAULT 0,',
  '  repeat TEXT',
  ')',
  'CREATE TABLE completions (',
  '  id INTEGER PRIMARY KEY,',
  '  todo_id INTEGER NOT NULL REFERENCES todos (id) ON DELETE CASCADE,',
  '  due_at INTEGER NOT NULL,',
  '  done_at INTEGER NOT NULL,',
  '  skipped INTEGER NOT NULL DEFAULT 0',
  ')',
].join('\n')
