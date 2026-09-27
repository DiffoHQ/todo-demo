# Recurring todos

A todo can repeat. Instead of a due date, give it a rule:

| You type | It repeats |
| --- | --- |
| `daily`, `every day` | every day |
| `every monday` … `every sunday` | weekly, on that day |
| `weekly`, `every week` | weekly, on today's weekday |
| `every 3 days`, `every 2 weeks` | every n days or weeks |
| `monthly`, `every month on the 15th` | monthly, on that day |

Add `until <date>` to stop it: `every monday until 2026-12-31`, or `daily until friday`.

## Done, skip, and the next date

`todo done <id>` on a repeating todo does not finish it. It moves to the next
occurrence **after today**, not after the date it was due, so a todo you left
overdue for a month comes back once. Past its `until`, done finishes it like
any other todo.

`todo skip <id>` moves on the same way, without counting it as done.

## Streaks

`todo list` shows how many occurrences in a row you did on time, from 2 up:

    [ ] #2 water plants  Wed Sep 30 2026  ↻ every 3 days  ×4 in a row

A skip steps over the streak; an occurrence done late ends it.

## Month ends

A monthly rule on the 29th, 30th or 31st lands on the last day of shorter
months: `every month on the 31st` is due on February 28th, then March 31st.
