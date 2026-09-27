import type { Todo } from '../model/todo.js'

/** `due` is `dueAt` here too, and a repeating todo carries its rule as stored. */
export function renderJson(todos: Todo[]): string {
  return JSON.stringify(
    todos.map((t) => ({
      id: t.id,
      title: t.title,
      dueAt: t.dueAt?.toISOString() ?? null,
      repeat: t.repeat,
      done: t.done,
    })),
    null,
    2,
  )
}
