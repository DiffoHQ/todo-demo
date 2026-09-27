import type { Database } from '../db.js'
import { init } from './001-init.js'
import { done } from './002-done.js'
import { recurrence } from './003-recurrence.js'
import { completions } from './004-completions.js'

export interface Migration {
  id: number
  up: (db: Database) => void
}

export const MIGRATIONS: Migration[] = [init, done, recurrence, completions]

/** Each migration runs in its own transaction, so a failed one leaves the version where it was. */
export function migrate(db: Database): void {
  const applied = db.userVersion()
  for (const m of MIGRATIONS) {
    if (m.id <= applied) continue
    db.transaction(() => {
      m.up(db)
      db.setUserVersion(m.id)
    })
  }
}
