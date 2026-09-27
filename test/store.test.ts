import { beforeEach, describe, expect, it } from 'vitest'
import { type Database, openDb } from '../src/store/db.js'
import { migrate } from '../src/store/migrations/index.js'
import { completeTodo, insertTodo, listTodos } from '../src/store/todos.js'

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
  it('marks done', () => {
    const t = insertTodo(db, 'call mum', null)
    completeTodo(db, t.id)
    expect(listTodos(db)[0]?.done).toBe(true)
  })
})
