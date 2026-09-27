import { describe, expect, it } from 'vitest'
import { streak } from '../src/scheduler/streak.js'
import type { Completion } from '../src/store/completions.js'

const day = (d: number, h = 9) => new Date(2026, 8, d, h)
const onTime = (d: number): Completion => ({ dueAt: day(d, 0), doneAt: day(d), skipped: false })
const late = (d: number): Completion => ({ dueAt: day(d, 0), doneAt: day(d + 1), skipped: false })
const skipped = (d: number): Completion => ({ dueAt: day(d, 0), doneAt: day(d), skipped: true })

describe('streak', () => {
  it('is zero with no history', () => {
    expect(streak([])).toBe(0)
  })
  it('counts on-time occurrences, newest first', () => {
    expect(streak([onTime(23), onTime(22), onTime(21)])).toBe(3)
  })
  it('stops at the first late one', () => {
    expect(streak([onTime(23), late(22), onTime(21)])).toBe(1)
  })
  it('steps over a skip', () => {
    expect(streak([onTime(23), skipped(22), onTime(21)])).toBe(2)
  })
})
