import { nextOccurrence } from '../model/recurrence.js'
import type { Todo } from '../model/todo.js'
import { logCompletion } from '../store/completions.js'
import type { Database } from '../store/db.js'
import { completeTodo, rescheduleTodo } from '../store/todos.js'

export interface RolloverOptions {
  now?: Date
  /** Move past this occurrence without counting it as done. */
  skip?: boolean
}

/**
 * Completing a repeating todo does not finish it: it moves to its next
 * occurrence after `now`, not after the missed due date, so a todo that sat
 * overdue for a month comes back once, not thirty times. Returns the new due
 * date, or null when the todo is now finished: one-off, or past its `until`.
 */
export function rollover(db: Database, todo: Todo, { now = new Date(), skip = false }: RolloverOptions = {}): Date | null {
  if (!todo.repeat) {
    completeTodo(db, todo.id)
    return null
  }
  const rule = todo.repeat
  return db.transaction(() => {
    logCompletion(db, todo.id, { dueAt: todo.dueAt ?? now, doneAt: now, skipped: skip })
    const next = nextOccurrence(rule, now)
    if (next) rescheduleTodo(db, todo.id, next)
    else completeTodo(db, todo.id)
    return next
  })
}
