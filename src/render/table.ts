import { describeRule } from '../model/recurrence.js'
import { isOverdue, type Todo } from '../model/todo.js'

/** `streaks` maps a repeating todo's id to its current run; a run under 2 is not shown. */
export function renderTable(todos: Todo[], streaks: ReadonlyMap<number, number> = new Map()): string {
  if (todos.length === 0) return 'nothing to do'
  return todos
    .map((t) => {
      const mark = t.done ? '[x]' : isOverdue(t) ? '[!]' : '[ ]'
      const due = t.dueAt ? '  ' + t.dueAt.toDateString() : ''
      const repeat = t.repeat ? '  ↻ ' + describeRule(t.repeat) : ''
      const run = streaks.get(t.id) ?? 0
      return mark + ' #' + t.id + ' ' + t.title + due + repeat + (run >= 2 ? `  ×${run} in a row` : '')
    })
    .join('\n')
}
