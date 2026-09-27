export interface Todo {
  id: number
  title: string
  due: Date | null
  done: boolean
}

export function isOverdue(todo: Todo, now = new Date()): boolean {
  return !todo.done && todo.due !== null && todo.due < now
}
