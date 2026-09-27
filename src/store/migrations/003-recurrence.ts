import type { Migration } from './index.js'

/**
 * `due` becomes `due_at`: a repeating todo has many due dates, and the column
 * holds the next one. `repeat` holds the rule as JSON, null for a one-off.
 * Existing rows keep their dates and read as one-off todos.
 */
export const recurrence: Migration = {
  id: 3,
  up: (db) => {
    db.exec('ALTER TABLE todos RENAME COLUMN due TO due_at')
    db.exec('ALTER TABLE todos ADD COLUMN repeat TEXT')
  },
}
