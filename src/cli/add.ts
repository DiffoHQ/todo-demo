import { ScheduleError } from '../dates/errors.js'
import { parseSchedule, type Schedule } from '../dates/parse.js'
import { describeWhen } from '../render/when.js'
import type { Database } from '../store/db.js'
import { insertTodo } from '../store/todos.js'
import { fail } from './args.js'

const USAGE = 'todo add <title> [due | every <weekday> | every <n> days | daily | monthly] [until <date>]'

export function add(db: Database, args: string[]): void {
  const [title, ...rest] = args
  if (!title) fail(USAGE)
  const schedule = rest.length ? readSchedule(rest.join(' ')) : { dueAt: null, repeat: null }
  const todo = insertTodo(db, title, schedule.dueAt, schedule.repeat)
  console.log(`#${todo.id} ${todo.title}${describeWhen(todo)}`)
}

function readSchedule(text: string): Schedule {
  try {
    return parseSchedule(text)
  } catch (err) {
    if (err instanceof ScheduleError) fail(err.message)
    throw err
  }
}
