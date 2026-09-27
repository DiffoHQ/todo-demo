import { execFileSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

function todo(...args: string[]): string {
  const env = { ...process.env, TODO_DB: join(mkdtempSync(join(tmpdir(), 'todo-')), 'todo.db') }
  return execFileSync('node', ['dist/cli/index.js', ...args], { env, encoding: 'utf8' })
}

describe('todo cli', () => {
  it('adds and lists', () => {
    expect(todo('add', 'renew passport', 'friday')).toMatch(/^#1 renew passport/)
  })
})
