import { describeRule } from '../model/recurrence.js'
import type { Todo } from '../model/todo.js'

/** " (due Fri Sep 25 2026)", " (every monday, next Mon Sep 28 2026)", or "" for no date. */
export function describeWhen(todo: Pick<Todo, 'dueAt' | 'repeat'>): string {
  if (todo.repeat && todo.dueAt) return ` (${describeRule(todo.repeat)}, next ${todo.dueAt.toDateString()})`
  return todo.dueAt ? ` (due ${todo.dueAt.toDateString()})` : ''
}
