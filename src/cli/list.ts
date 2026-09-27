import { renderJson } from '../render/json.js'
import { renderTable } from '../render/table.js'
import type { Database } from '../store/db.js'
import { listTodos } from '../store/todos.js'

export function list(db: Database, args: string[]): void {
  const todos = listTodos(db)
  console.log(args.includes('--json') ? renderJson(todos) : renderTable(todos))
}
