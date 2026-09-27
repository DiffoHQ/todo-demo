import { describe, expect, it } from 'vitest'
import { parseDue } from '../src/dates/parse.js'

const wed = new Date('2026-09-23T10:00:00') // a Wednesday

describe('parseDue', () => {
  it('reads tomorrow', () => {
    expect(parseDue('tomorrow', wed)?.getDate()).toBe(24)
  })
  it('reads "in N days"', () => {
    expect(parseDue('in 3 days', wed)?.getDate()).toBe(26)
  })
  it('reads a weekday', () => {
    expect(parseDue('friday', wed)?.getDate()).toBe(25)
  })
})
