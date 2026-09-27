import type { Database } from '../store/db.js'
import { completeTodo } from '../store/todos.js'

export function done(db: Database, args: string[]): void {
  const id = Number(args[0])
  if (!Number.isInteger(id)) {
    console.error('todo done <id>')
    process.exit(1)
  }
  completeTodo(db, id)
  console.log('done #' + id)
}
