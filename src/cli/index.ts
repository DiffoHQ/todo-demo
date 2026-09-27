import { openDb } from '../store/db.js'
import { migrate } from '../store/migrations/index.js'
import { add } from './add.js'
import { done } from './done.js'
import { list } from './list.js'
import { skip } from './skip.js'

const USAGE = [
  'usage:',
  '  todo add <title> [due | every <weekday> | every <n> days | daily | monthly] [until <date>]',
  '  todo list [--json] [--repeating]',
  '  todo done <id>        a repeating todo rolls to its next date',
  '  todo skip <id>        skip one occurrence of a repeating todo',
].join('\n')

const COMMANDS = { add, list, done, skip }

const [cmd, ...args] = process.argv.slice(2)
if (!cmd || !Object.hasOwn(COMMANDS, cmd)) {
  console.error(USAGE)
  process.exit(1)
}

const db = openDb(process.env.TODO_DB ?? 'todo.db')
migrate(db)
COMMANDS[cmd as keyof typeof COMMANDS](db, args)
