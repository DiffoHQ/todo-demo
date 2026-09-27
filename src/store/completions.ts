import type { Database } from './db.js'

export interface Completion {
  /** The occurrence this was: the todo's due date at the time. */
  dueAt: Date
  doneAt: Date
  /** Skipped rather than done. It moved the todo on without counting as doing it. */
  skipped: boolean
}

interface Row {
  due_at: number
  done_at: number
  skipped: number
}

export function logCompletion(db: Database, todoId: number, c: Completion): void {
  db.run(
    'INSERT INTO completions (todo_id, due_at, done_at, skipped) VALUES (?, ?, ?, ?)',
    todoId,
    c.dueAt.getTime(),
    c.doneAt.getTime(),
    c.skipped ? 1 : 0,
  )
}

/** Newest occurrence first. */
export function completionsFor(db: Database, todoId: number): Completion[] {
  return db
    .all<Row>('SELECT due_at, done_at, skipped FROM completions WHERE todo_id = ? ORDER BY due_at DESC, id DESC', todoId)
    .map((r) => ({ dueAt: new Date(r.due_at), doneAt: new Date(r.done_at), skipped: r.skipped === 1 }))
}
