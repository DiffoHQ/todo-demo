import type { Todo } from '../model/todo.js'
import type { Database } from '../store/db.js'
import { getTodo } from '../store/todos.js'

export function fail(message: string): never {
  console.error(message)
  process.exit(1)
}

/** The todo named by an `<id>` argument, or exit with `usage` (no id) or "no todo #…". */
export function findTodo(db: Database, arg: string | undefined, usage: string): Todo {
  if (arg === undefined) fail(usage)
  const id = Number(arg)
  const todo = Number.isInteger(id) ? getTodo(db, id) : undefined
  return todo ?? fail(`no todo #${arg}`)
}
