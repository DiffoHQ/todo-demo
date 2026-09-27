import type { Migration } from './index.js'

export const init: Migration = {
  id: 1,
  up: (db) => {
    db.exec('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, title TEXT NOT NULL, due INTEGER)')
  },
}
