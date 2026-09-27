import { describe, expect, it } from 'vitest'
import { ScheduleError } from '../src/dates/errors.js'
import { parseDue, parseSchedule } from '../src/dates/parse.js'

const wed = new Date('2026-09-23T10:00:00') // a Wednesday

describe('parseDue', () => {
  it('reads tomorrow', () => {
    expect(parseDue('tomorrow', wed)?.getDate()).toBe(24)
  })
  it('reads "in N days"', () => {
    expect(parseDue('in 3 days', wed)?.getDate()).toBe(26)
  })
  it('reads a weekday', () => {
    expect(parseDue('friday', wed)?.getDate()).toBe(25)
  })
})

describe('parseSchedule', () => {
  it('a plain date has no rule', () => {
    expect(parseSchedule('friday', wed)).toEqual({ dueAt: parseDue('friday', wed), repeat: null })
  })
  it('a rule also sets the first due date', () => {
    const s = parseSchedule('every friday', wed)
    expect(s.repeat).toEqual({ kind: 'weekly', weekday: 5 })
    expect(s.dueAt?.getDate()).toBe(25)
  })
  it('reads an end date', () => {
    expect(parseSchedule('every 3 days until 2026-10-31', wed).repeat).toEqual({
      kind: 'every',
      days: 3,
      until: '2026-10-31',
    })
  })
  it('reads a natural-language end date', () => {
    expect(parseSchedule('daily until friday', wed).repeat?.until).toBe('2026-09-25')
  })
  it('rejects a rule that ends before it starts', () => {
    expect(() => parseSchedule('every monday until friday', wed)).toThrow(ScheduleError)
  })
  it('rejects until after a plain date', () => {
    expect(() => parseSchedule('friday until monday', wed)).toThrow(/goes after a recurrence/)
  })
})
