/**
 * Text that reads like a schedule but cannot be one ("every 0 days", "every
 * month on the 32nd"). The CLI prints the message as it is, so it is written
 * for the person who typed the command.
 */
export class ScheduleError extends Error {
  override name = 'ScheduleError'
}
