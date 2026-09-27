import { rollover } from '../scheduler/rollover.js'
import type { Database } from '../store/db.js'
import { findTodo } from './args.js'

export function done(db: Database, args: string[]): void {
  const todo = findTodo(db, args[0], 'todo done <id>')
  const next = rollover(db, todo)
  console.log(next ? `done #${todo.id}, next ${next.toDateString()}` : `done #${todo.id}`)
}
