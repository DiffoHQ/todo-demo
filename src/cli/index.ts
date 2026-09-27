import { openDb } from '../store/db.js'
import { migrate } from '../store/migrations/index.js'
import { add } from './add.js'
import { done } from './done.js'
import { list } from './list.js'

const USAGE = [
  'usage:',
  '  todo add <title> [due]',
  '  todo list [--json]',
  '  todo done <id>',
].join('\n')

const [cmd, ...args] = process.argv.slice(2)
const db = openDb(process.env.TODO_DB ?? 'todo.db')
migrate(db)

if (cmd === 'add') add(db, args)
else if (cmd === 'list') list(db, args)
else if (cmd === 'done') done(db, args)
else {
  console.error(USAGE)
  process.exit(1)
}
