import type { Migration } from './index.js'

export const done: Migration = {
  id: 2,
  up: (db) => {
    db.exec('ALTER TABLE todos ADD COLUMN done INTEGER NOT NULL DEFAULT 0')
  },
}
