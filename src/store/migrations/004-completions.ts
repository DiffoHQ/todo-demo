import type { Migration } from './index.js'

/**
 * One row per occurrence of a repeating todo that was done or skipped. A
 * one-off todo never gets one: its `done` column already says everything.
 */
export const completions: Migration = {
  id: 4,
  up: (db) => {
    db.exec(`CREATE TABLE completions (
      id INTEGER PRIMARY KEY,
      todo_id INTEGER NOT NULL REFERENCES todos (id) ON DELETE CASCADE,
      due_at INTEGER NOT NULL,
      done_at INTEGER NOT NULL,
      skipped INTEGER NOT NULL DEFAULT 0
    )`)
    db.exec('CREATE INDEX completions_by_todo ON completions (todo_id, due_at)')
  },
}
