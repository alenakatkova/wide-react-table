import { describe, expect, it } from 'vitest'

describe('unit test environment', () => {
  // If the unit project picked up browser test files, or the other way round, one of the two environment tests fails
  it('FEAT-004: unit tests run in jsdom', () => {
    expect(navigator.userAgent).toContain('jsdom')
  })
})
