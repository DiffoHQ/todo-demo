import type { Todo } from '../model/todo.js'

export function renderJson(todos: Todo[]): string {
  return JSON.stringify(
    todos.map((t) => ({ id: t.id, title: t.title, due: t.due?.toISOString() ?? null, done: t.done })),
    null,
    2,
  )
}
