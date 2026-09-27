/**
 * Calendar-day arithmetic in local time. Days are added with `setDate`, never
 * as multiples of 24h, so a daylight-saving change cannot move a due date off
 * midnight.
 */

export const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

export type Weekday = (typeof WEEKDAYS)[number]

/** 0 for sunday … 6 for saturday, or -1 when `name` is not a weekday. */
export function weekdayIndex(name: string): number {
  return WEEKDAYS.indexOf(name as Weekday)
}

export function startOfDay(d: Date): Date {
  const out = new Date(d)
  out.setHours(0, 0, 0, 0)
  return out
}

export function addDays(d: Date, n: number): Date {
  const out = new Date(d)
  out.setDate(out.getDate() + n)
  return out
}
