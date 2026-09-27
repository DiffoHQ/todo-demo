import { rollover } from '../scheduler/rollover.js'
import type { Database } from '../store/db.js'
import { fail, findTodo } from './args.js'

/** Move a repeating todo past this occurrence without doing it, and without breaking its streak. */
export function skip(db: Database, args: string[]): void {
  const todo = findTodo(db, args[0], 'todo skip <id>')
  if (!todo.repeat) fail(`#${todo.id} does not repeat; to finish it, run todo done ${todo.id}`)
  const next = rollover(db, todo, { skip: true })
  console.log(next ? `skipped #${todo.id}, next ${next.toDateString()}` : `skipped #${todo.id}, the last one`)
}
