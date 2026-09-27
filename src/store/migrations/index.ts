import type { Database } from '../db.js'
import { init } from './001-init.js'
import { done } from './002-done.js'

export interface Migration {
  id: number
  up: (db: Database) => void
}

export const MIGRATIONS: Migration[] = [init, done]

export function migrate(db: Database): void {
  const applied = db.userVersion()
  for (const m of MIGRATIONS) {
    if (m.id <= applied) continue
    m.up(db)
    db.setUserVersion(m.id)
  }
}
