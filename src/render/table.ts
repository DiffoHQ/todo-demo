import { isOverdue, type Todo } from '../model/todo.js'

export function renderTable(todos: Todo[]): string {
  return todos
    .map((t) => {
      const mark = t.done ? '[x]' : isOverdue(t) ? '[!]' : '[ ]'
      const due = t.due ? '  ' + t.due.toDateString() : ''
      return mark + ' #' + t.id + ' ' + t.title + due
    })
    .join('\n')
}
