import { addDays, addMonths, fromIsoDay, startOfDay, WEEKDAYS } from '../dates/days.js'

/** How a todo comes back once it is done. */
export type Rule = (
  | { kind: 'daily' }
  | { kind: 'weekly'; weekday: number }
  | { kind: 'every'; days: number }
  | { kind: 'monthly'; day: number }
) & {
  /** Last day an occurrence may fall on, as `YYYY-MM-DD`. Past it, the todo finishes. */
  until?: string
}

/**
 * The first occurrence strictly after `from`, or null once the rule has run
 * past its `until`. The one place that turns a rule into a date: adding,
 * completing and skipping all go through it.
 */
export function nextOccurrence(rule: Rule, from: Date): Date | null {
  const next = step(rule, startOfDay(from))
  if (rule.until !== undefined && next > fromIsoDay(rule.until)) return null
  return next
}

function step(rule: Rule, day: Date): Date {
  switch (rule.kind) {
    case 'daily':
      return addDays(day, 1)
    case 'every':
      return addDays(day, rule.days)
    case 'weekly': {
      const delta = (rule.weekday - day.getDay() + 7) % 7 || 7
      return addDays(day, delta)
    }
    case 'monthly': {
      const thisMonth = addMonths(day, 0, rule.day)
      return thisMonth > day ? thisMonth : addMonths(day, 1, rule.day)
    }
  }
}

/** "every monday", "every 3 days", "monthly on the 1st until 2026-12-31". */
export function describeRule(rule: Rule): string {
  const text = describeKind(rule)
  return rule.until === undefined ? text : `${text} until ${rule.until}`
}

function describeKind(rule: Rule): string {
  switch (rule.kind) {
    case 'daily':
      return 'daily'
    case 'weekly':
      return `every ${WEEKDAYS[rule.weekday]}`
    case 'every': {
      if (rule.days % 7 !== 0) return `every ${rule.days} days`
      const weeks = rule.days / 7
      return weeks === 1 ? 'every week' : `every ${weeks} weeks`
    }
    case 'monthly':
      return `monthly on the ${ordinal(rule.day)}`
  }
}

function ordinal(n: number): string {
  const teen = n % 100 >= 11 && n % 100 <= 13
  return n + (teen ? 'th' : (['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'))
}
