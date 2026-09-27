import type { Todo } from '../model/todo.js'
import type { Database } from './db.js'

interface Row {
  id: number
  title: string
  due: number | null
  done: number
}

function fromRow(r: Row): Todo {
  return { id: r.id, title: r.title, due: r.due === null ? null : new Date(r.due), done: r.done === 1 }
}

export function insertTodo(db: Database, title: string, due: Date | null): Todo {
  const res = db.run('INSERT INTO todos (title, due) VALUES (?, ?)', title, due ? due.getTime() : null)
  return { id: Number(res.lastInsertRowid), title, due, done: false }
}

export function listTodos(db: Database): Todo[] {
  return db.all<Row>('SELECT * FROM todos ORDER BY due IS NULL, due, id').map(fromRow)
}

export function completeTodo(db: Database, id: number): void {
  db.run('UPDATE todos SET done = 1 WHERE id = ?', id)
}
