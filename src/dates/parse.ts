import { nextOccurrence, type Rule } from '../model/recurrence.js'
import { addDays, fromIsoDay, startOfDay, toIsoDay, weekdayIndex } from './days.js'
import { ScheduleError } from './errors.js'
import { parseRule } from './recurrence.js'

export interface Schedule {
  /** The first due date. */
  dueAt: Date | null
  repeat: Rule | null
}

/**
 * A due date ("tomorrow", "friday", "in 3 days"), or a recurrence with an
 * optional end ("every monday", "every 3 days until 2026-12-31"). A plain date
 * parses exactly as it did before recurrence existed.
 */
export function parseSchedule(text: string, now = new Date()): Schedule {
  const [what, until] = text.split(/\s+until\s+/i)
  const rule = parseRule(what!, now)
  if (!rule) {
    if (until !== undefined) throw new ScheduleError('"until" goes after a recurrence, as in "every monday until friday"')
    return { dueAt: parseDue(text, now), repeat: null }
  }

  const repeat: Rule = until === undefined ? rule : { ...rule, until: toIsoDay(parseEnd(until, now)) }
  const dueAt = nextOccurrence(repeat, now)
  if (!dueAt) throw new ScheduleError(`"${text.trim()}" ends before it first comes around`)
  return { dueAt, repeat }
}

function parseEnd(text: string, now: Date): Date {
  const t = text.trim()
  const end = /^\d{4}-\d{2}-\d{2}$/.test(t) ? fromIsoDay(t) : parseDue(t, now)
  if (!end) throw new ScheduleError(`can't read "${t}" as an end date`)
  return end
}

/** Parse a natural-language due date ("tomorrow", "friday", "in 3 days"). */
export function parseDue(text: string, now = new Date()): Date | null {
  const t = text.trim().toLowerCase()
  if (t === 'today') return startOfDay(now)
  if (t === 'tomorrow') return addDays(startOfDay(now), 1)

  const inDays = /^in (\d+) days?$/.exec(t)
  if (inDays) return addDays(startOfDay(now), Number(inDays[1]))

  const day = weekdayIndex(t)
  if (day !== -1) return addDays(startOfDay(now), (day - now.getDay() + 7) % 7 || 7)
  return null
}
