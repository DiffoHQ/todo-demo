import { beforeEach, describe, expect, it } from 'vitest'
import { completionsFor, logCompletion } from '../src/store/completions.js'
import { type Database, openDb } from '../src/store/db.js'
import { init } from '../src/store/migrations/001-init.js'
import { done } from '../src/store/migrations/002-done.js'
import { migrate } from '../src/store/migrations/index.js'
import { completeTodo, getTodo, insertTodo, listTodos, rescheduleTodo } from '../src/store/todos.js'

let db: Database
beforeEach(() => {
  db = openDb(':memory:')
  migrate(db)
})

describe('todos store', () => {
  it('round-trips a todo', () => {
    const t = insertTodo(db, 'renew passport', new Date('2026-09-25'))
    expect(listTodos(db)).toEqual([t])
  })
  it('round-trips a rule', () => {
    const t = insertTodo(db, 'water plants', new Date('2026-09-24'), { kind: 'every', days: 3, until: '2026-12-31' })
    expect(getTodo(db, t.id)?.repeat).toEqual({ kind: 'every', days: 3, until: '2026-12-31' })
  })
  it('lists only repeating todos when asked', () => {
    insertTodo(db, 'renew passport', null)
    const plants = insertTodo(db, 'water plants', null, { kind: 'daily' })
    expect(listTodos(db, { repeating: true }).map((t) => t.id)).toEqual([plants.id])
  })
  it('marks done', () => {
    const t = insertTodo(db, 'call mum', null)
    completeTodo(db, t.id)
    expect(listTodos(db)[0]?.done).toBe(true)
  })
  it('reschedules and reopens', () => {
    const t = insertTodo(db, 'standup', new Date('2026-09-28'), { kind: 'weekly', weekday: 1 })
    completeTodo(db, t.id)
    rescheduleTodo(db, t.id, new Date('2026-10-05'))
    expect(getTodo(db, t.id)).toMatchObject({ dueAt: new Date('2026-10-05'), done: false })
  })
})

describe('completions', () => {
  it('lists the newest occurrence first', () => {
    const t = insertTodo(db, 'standup', null, { kind: 'daily' })
    logCompletion(db, t.id, { dueAt: new Date('2026-09-21'), doneAt: new Date('2026-09-21'), skipped: false })
    logCompletion(db, t.id, { dueAt: new Date('2026-09-22'), doneAt: new Date('2026-09-22'), skipped: true })
    expect(completionsFor(db, t.id).map((c) => c.skipped)).toEqual([true, false])
  })
})

describe('migration 003', () => {
  it('keeps the due dates of existing todos', () => {
    const old = openDb(':memory:')
    for (const m of [init, done]) m.up(old)
    old.setUserVersion(2)
    old.run('INSERT INTO todos (title, due) VALUES (?, ?)', 'renew passport', new Date('2026-09-25').getTime())

    migrate(old)
    expect(listTodos(old)).toEqual([
      { id: 1, title: 'renew passport', dueAt: new Date('2026-09-25'), repeat: null, done: false },
    ])
  })
})

describe('transaction', () => {
  it('rolls back every write when one fails', () => {
    expect(() =>
      db.transaction(() => {
        insertTodo(db, 'renew passport', null)
        throw new Error('boom')
      }),
    ).toThrow('boom')
    expect(listTodos(db)).toEqual([])
  })
})
