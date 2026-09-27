import { parseDue } from '../dates/parse.js'
import type { Database } from '../store/db.js'
import { insertTodo } from '../store/todos.js'

export function add(db: Database, args: string[]): void {
  const [title, ...rest] = args
  if (!title) {
    console.error('todo add <title> [due]')
    process.exit(1)
  }
  const due = rest.length ? parseDue(rest.join(' ')) : null
  const todo = insertTodo(db, title, due)
  console.log('#' + todo.id + ' ' + todo.title + (due ? ' (due ' + due.toDateString() + ')' : ''))
}
