import { beforeEach, describe, expect, it } from 'vitest'
import { rollover } from '../src/scheduler/rollover.js'
import { completionsFor } from '../src/store/completions.js'
import { type Database, openDb } from '../src/store/db.js'
import { migrate } from '../src/store/migrations/index.js'
import { getTodo, insertTodo } from '../src/store/todos.js'

const wed = new Date('2026-09-23T10:00:00')

let db: Database
beforeEach(() => {
  db = openDb(':memory:')
  migrate(db)
})

describe('rollover', () => {
  it('finishes a one-off todo, and logs nothing', () => {
    const t = insertTodo(db, 'renew passport', wed)
    expect(rollover(db, t, { now: wed })).toBeNull()
    expect(getTodo(db, t.id)?.done).toBe(true)
    expect(completionsFor(db, t.id)).toEqual([])
  })
  it('moves a repeating todo to its next date, still open', () => {
    const t = insertTodo(db, 'water plants', wed, { kind: 'every', days: 3 })
    expect(rollover(db, t, { now: wed })?.getDate()).toBe(26)
    expect(getTodo(db, t.id)?.done).toBe(false)
  })
  it('counts from now, not from the missed date', () => {
    const lastMonth = new Date('2026-08-20T10:00:00')
    const t = insertTodo(db, 'pay rent', lastMonth, { kind: 'every', days: 30 })
    expect(rollover(db, t, { now: wed })?.getMonth()).toBe(9)
    expect(completionsFor(db, t.id)).toHaveLength(1)
  })
  it('finishes a rule past its until', () => {
    const t = insertTodo(db, 'physio', wed, { kind: 'weekly', weekday: 3, until: '2026-09-29' })
    expect(rollover(db, t, { now: wed })).toBeNull()
    expect(getTodo(db, t.id)?.done).toBe(true)
  })
  it('logs a skip as skipped', () => {
    const t = insertTodo(db, 'gym', wed, { kind: 'daily' })
    rollover(db, t, { now: wed, skip: true })
    expect(completionsFor(db, t.id)[0]?.skipped).toBe(true)
  })
})
