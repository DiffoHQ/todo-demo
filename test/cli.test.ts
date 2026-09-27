import { execFileSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { beforeEach, describe, expect, it } from 'vitest'

let dbPath: string
beforeEach(() => {
  dbPath = join(mkdtempSync(join(tmpdir(), 'todo-')), 'todo.db')
})

function todo(...args: string[]): string {
  const env = { ...process.env, TODO_DB: dbPath, NODE_NO_WARNINGS: '1' }
  return execFileSync('node', ['dist/cli/index.js', ...args], { env, encoding: 'utf8' })
}

/** stderr of a command expected to fail. */
function todoFails(...args: string[]): string {
  try {
    todo(...args)
  } catch (err) {
    return String((err as { stderr: string }).stderr)
  }
  throw new Error(`todo ${args.join(' ')} succeeded`)
}

describe('todo cli', () => {
  it('adds and lists', () => {
    expect(todo('add', 'renew passport', 'friday')).toMatch(/^#1 renew passport \(due /)
    expect(todo('list')).toMatch(/\[ \] #1 renew passport/)
  })
  it('adds a repeating todo', () => {
    expect(todo('add', 'water plants', 'every', '3', 'days')).toMatch(/every 3 days, next /)
    expect(todo('list', '--repeating')).toMatch(/↻ every 3 days/)
  })
  it('rolls a repeating todo forward on done', () => {
    todo('add', 'standup', 'daily')
    expect(todo('done', '1')).toMatch(/^done #1, next /)
    expect(todo('list')).toMatch(/\[ \] #1 standup/)
  })
  it('skips an occurrence', () => {
    todo('add', 'gym', 'every', 'monday')
    expect(todo('skip', '1')).toMatch(/^skipped #1, next /)
  })
  it('refuses to skip a one-off todo', () => {
    todo('add', 'renew passport', 'friday')
    expect(todoFails('skip', '1')).toMatch(/does not repeat/)
  })
  it('explains a schedule it cannot read', () => {
    expect(todoFails('add', 'water plants', 'every', 'fortnight')).toMatch(/can't read "every fortnight"/)
  })
  it('names a missing todo', () => {
    expect(todoFails('done', '9')).toMatch(/no todo #9/)
  })
})
