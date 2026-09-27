import { isOverdue, type Todo } from './model/todo.js'

/** One line per overdue todo, for the shell prompt hook. */
export function overdueLines(todos: Todo[], now = new Date()): string[] {
  return todos.filter((t) => isOverdue(t, now)).map((t) => t.title + ' was due ' + t.due!.toDateString())
}
