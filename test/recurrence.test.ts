import { describe, expect, it } from 'vitest'
import { ScheduleError } from '../src/dates/errors.js'
import { parseRule } from '../src/dates/recurrence.js'
import { describeRule, nextOccurrence } from '../src/model/recurrence.js'

const wed = new Date('2026-09-23T10:00:00') // a Wednesday

describe('parseRule', () => {
  it.each([
    ['daily', { kind: 'daily' }],
    ['every day', { kind: 'daily' }],
    ['every 1 day', { kind: 'daily' }],
    ['every monday', { kind: 'weekly', weekday: 1 }],
    ['Every  Friday', { kind: 'weekly', weekday: 5 }],
    ['weekly', { kind: 'weekly', weekday: 3 }],
    ['every 3 days', { kind: 'every', days: 3 }],
    ['every 2 weeks', { kind: 'every', days: 14 }],
    ['monthly', { kind: 'monthly', day: 23 }],
    ['every month on the 1st', { kind: 'monthly', day: 1 }],
  ])('reads %j', (text, rule) => {
    expect(parseRule(text, wed)).toEqual(rule)
  })

  it('is null for a plain due date', () => {
    expect(parseRule('friday', wed)).toBeNull()
    expect(parseRule('in 3 days', wed)).toBeNull()
  })

  it.each(['every 0 days', 'every month on the 32nd', 'every fortnight'])('rejects %j', (text) => {
    expect(() => parseRule(text, wed)).toThrow(ScheduleError)
  })
})

describe('nextOccurrence', () => {
  it('daily is tomorrow', () => {
    expect(nextOccurrence({ kind: 'daily' }, wed)?.getDate()).toBe(24)
  })
  it('every n days counts from the given day', () => {
    expect(nextOccurrence({ kind: 'every', days: 3 }, wed)?.getDate()).toBe(26)
  })
  it('weekly lands on the next matching weekday', () => {
    expect(nextOccurrence({ kind: 'weekly', weekday: 1 }, wed)?.getDate()).toBe(28)
  })
  it('a weekly rule naming today lands next week', () => {
    expect(nextOccurrence({ kind: 'weekly', weekday: 3 }, wed)?.getDate()).toBe(30)
  })
  it('monthly clamps to the end of a short month', () => {
    const jan31 = new Date('2027-01-31T09:00:00')
    const next = nextOccurrence({ kind: 'monthly', day: 31 }, jan31)
    expect([next?.getMonth(), next?.getDate()]).toEqual([1, 28])
  })
  it('is null once past until', () => {
    expect(nextOccurrence({ kind: 'weekly', weekday: 1, until: '2026-09-27' }, wed)).toBeNull()
  })
  it('stays on midnight across the DST change', () => {
    const next = nextOccurrence({ kind: 'every', days: 7 }, new Date('2026-10-22T10:00:00'))
    expect([next?.getDate(), next?.getHours()]).toEqual([29, 0])
  })
})

describe('describeRule', () => {
  it.each([
    [{ kind: 'daily' }, 'daily'],
    [{ kind: 'weekly', weekday: 1 }, 'every monday'],
    [{ kind: 'every', days: 3 }, 'every 3 days'],
    [{ kind: 'every', days: 7 }, 'every week'],
    [{ kind: 'every', days: 14 }, 'every 2 weeks'],
    [{ kind: 'monthly', day: 22 }, 'monthly on the 22nd'],
    [{ kind: 'monthly', day: 11, until: '2026-12-31' }, 'monthly on the 11th until 2026-12-31'],
  ] as const)('%j reads %j', (rule, text) => {
    expect(describeRule(rule)).toBe(text)
  })
})
