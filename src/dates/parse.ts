const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

/** Parse a natural-language due date ("tomorrow", "friday", "in 3 days"). */
export function parseDue(text: string, now = new Date()): Date | null {
  const t = text.trim().toLowerCase()
  if (t === 'today') return startOfDay(now)
  if (t === 'tomorrow') return addDays(startOfDay(now), 1)

  const inDays = /^in (\d+) days?$/.exec(t)
  if (inDays) return addDays(startOfDay(now), Number(inDays[1]))

  const day = WEEKDAYS.indexOf(t)
  if (day !== -1) return addDays(startOfDay(now), ((day - now.getDay() + 7) % 7) || 7)
  return null
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
