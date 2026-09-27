import type { Rule } from './recurrence.js'

export interface Todo {
  id: number
  title: string
  /** Renamed from `due`: a repeating todo has many due dates, and this is the next one. */
  dueAt: Date | null
  /** Null for a one-off todo. */
  repeat: Rule | null
  done: boolean
}

export function isOverdue(todo: Todo, now = new Date()): boolean {
  return !todo.done && todo.dueAt !== null && todo.dueAt < now
}
