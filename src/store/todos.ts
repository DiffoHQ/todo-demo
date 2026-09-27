import type { Rule } from '../model/recurrence.js'
import type { Todo } from '../model/todo.js'
import type { Database } from './db.js'

interface Row {
  id: number
  title: string
  due_at: number | null
  repeat: string | null
  done: number
}

/** The one place a row becomes a Todo: nothing outside this file sees the JSON. */
function fromRow(r: Row): Todo {
  return {
    id: r.id,
    title: r.title,
    dueAt: r.due_at === null ? null : new Date(r.due_at),
    repeat: r.repeat === null ? null : (JSON.parse(r.repeat) as Rule),
    done: r.done === 1,
  }
}

export function insertTodo(db: Database, title: string, dueAt: Date | null, repeat: Rule | null = null): Todo {
  const res = db.run(
    'INSERT INTO todos (title, due_at, repeat) VALUES (?, ?, ?)',
    title,
    dueAt ? dueAt.getTime() : null,
    repeat ? JSON.stringify(repeat) : null,
  )
  return { id: Number(res.lastInsertRowid), title, dueAt, repeat, done: false }
}

export function getTodo(db: Database, id: number): Todo | undefined {
  const row = db.all<Row>('SELECT * FROM todos WHERE id = ?', id)[0]
  return row && fromRow(row)
}

export function listTodos(db: Database, { repeating = false } = {}): Todo[] {
  const where = repeating ? 'WHERE repeat IS NOT NULL' : ''
  return db.all<Row>(`SELECT * FROM todos ${where} ORDER BY due_at IS NULL, due_at, id`).map(fromRow)
}

export function completeTodo(db: Database, id: number): void {
  db.run('UPDATE todos SET done = 1 WHERE id = ?', id)
}

/** Move a repeating todo to its next occurrence, open again. */
export function rescheduleTodo(db: Database, id: number, dueAt: Date): void {
  db.run('UPDATE todos SET due_at = ?, done = 0 WHERE id = ?', dueAt.getTime(), id)
}
