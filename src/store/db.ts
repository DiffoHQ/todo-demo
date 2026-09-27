import { DatabaseSync } from 'node:sqlite'

export interface Database {
  exec(sql: string): void
  run(sql: string, ...params: unknown[]): { lastInsertRowid: number | bigint }
  all<T>(sql: string, ...params: unknown[]): T[]
  userVersion(): number
  setUserVersion(v: number): void
}

export function openDb(path: string): Database {
  const db = new DatabaseSync(path)
  return {
    exec: (sql) => db.exec(sql),
    run: (sql, ...params) => db.prepare(sql).run(...(params as never[])),
    all: <T>(sql: string, ...params: unknown[]) => db.prepare(sql).all(...(params as never[])) as T[],
    userVersion: () => Number((db.prepare('PRAGMA user_version').get() as { user_version: number }).user_version),
    setUserVersion: (v) => db.exec('PRAGMA user_version = ' + v),
  }
}
