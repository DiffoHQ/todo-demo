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

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/**
 * Day `day` of the month `n` months after `d`, clamped to that month's
 * length: the 31st of January plus one month is the 28th (or 29th) of
 * February, not the 3rd of March.
 */
export function addMonths(d: Date, n: number, day = d.getDate()): Date {
  const out = startOfDay(d)
  out.setDate(1)
  out.setMonth(out.getMonth() + n)
  out.setDate(Math.min(day, daysInMonth(out.getFullYear(), out.getMonth())))
  return out
}

/** `YYYY-MM-DD` in local time: how a rule stores its end date. */
export function toIsoDay(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function fromIsoDay(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y!, m! - 1, d)
}
