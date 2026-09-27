import { startOfDay } from '../dates/days.js'
import type { Completion } from '../store/completions.js'

/**
 * How many occurrences in a row were done on or before their day, counting
 * back from the newest. A skip neither breaks the run nor adds to it; one
 * done late ends it.
 */
export function streak(history: readonly Completion[]): number {
  let run = 0
  for (const c of history) {
    if (c.skipped) continue
    if (startOfDay(c.doneAt) > startOfDay(c.dueAt)) break
    run++
  }
  return run
}
