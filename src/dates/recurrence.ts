import type { Rule } from '../model/recurrence.js'
import { weekdayIndex } from './days.js'
import { ScheduleError } from './errors.js'

/**
 * "daily", "weekly", "monthly", "every monday", "every 3 days", "every 2 weeks",
 * "every month on the 15th" → a Rule. Null when the text is not a recurrence
 * at all, so the caller can try it as a plain due date; a ScheduleError when
 * it starts like one ("every …") but does not parse.
 */
export function parseRule(text: string, now = new Date()): Rule | null {
  const t = text.trim().toLowerCase().replace(/\s+/g, ' ')
  if (t === 'daily' || t === 'every day') return { kind: 'daily' }
  if (t === 'weekly' || t === 'every week') return { kind: 'weekly', weekday: now.getDay() }
  if (t === 'monthly' || t === 'every month') return { kind: 'monthly', day: now.getDate() }

  const every = /^every (.+)$/.exec(t)
  if (!every) return null
  const rest = every[1]!

  const weekday = weekdayIndex(rest)
  if (weekday !== -1) return { kind: 'weekly', weekday }

  const interval = /^(\d+) (day|week)s?$/.exec(rest)
  if (interval) {
    const count = Number(interval[1])
    if (count < 1) throw new ScheduleError(`"${t}" never comes around; use 1 or more`)
    const days = interval[2] === 'week' ? count * 7 : count
    return days === 1 ? { kind: 'daily' } : { kind: 'every', days }
  }

  const monthDay = /^month on the (\d+)(?:st|nd|rd|th)?$/.exec(rest)
  if (monthDay) {
    const day = Number(monthDay[1])
    if (day < 1 || day > 31) throw new ScheduleError(`no month has a day ${day}`)
    return { kind: 'monthly', day }
  }

  throw new ScheduleError(`can't read "${text.trim()}" as a recurrence; try "every monday" or "every 3 days"`)
}
