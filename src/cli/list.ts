import { renderJson } from '../render/json.js'
import { renderTable } from '../render/table.js'
import { streak } from '../scheduler/streak.js'
import { completionsFor } from '../store/completions.js'
import type { Database } from '../store/db.js'
import { listTodos } from '../store/todos.js'

export function list(db: Database, args: string[]): void {
  const todos = listTodos(db, { repeating: args.includes('--repeating') })
  if (args.includes('--json')) {
    console.log(renderJson(todos))
    return
  }
  const streaks = new Map(todos.filter((t) => t.repeat).map((t) => [t.id, streak(completionsFor(db, t.id))]))
  console.log(renderTable(todos, streaks))
}
