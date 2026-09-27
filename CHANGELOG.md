# Changelog

## Unreleased

- Recurring todos: `todo add <title> every monday`, `every 3 days`, `every 2 weeks`,
  `daily`, `monthly`, or `every month on the 15th`, optionally `until <date>`.
  Completing one rolls it to its next date instead of finishing it.
- `todo skip <id>` moves a repeating todo past one occurrence.
- `todo list` shows each rule and its streak; `--repeating` lists only those.
- `todo list --json`: `due` is now `dueAt`, and repeating todos carry `repeat`.

## 0.4.0

- Natural-language due dates: "tomorrow", "friday", "in 3 days".
- `todo done <id>` marks a todo complete.
