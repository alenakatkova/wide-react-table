import { describe, expect, it } from 'vitest'
import { createSeededRandom } from './seededRandom'

describe('seeded random numbers', () => {
  it('FEAT-004: seeded random numbers are from 0 up to, but not including, 1', () => {
    for (const seed of [0, 1, 7, 2 ** 32 - 1]) {
      const random = createSeededRandom(seed)
      for (let index = 0; index < 10_000; index++) {
        const value = random()
        expect(value).toBeGreaterThanOrEqual(0)
        expect(value).toBeLessThan(1)
      }
    }
  })

  it('FEAT-004: rejects a seed that is not a whole number from 0 to 2^32 − 1', () => {
    for (const seed of [1.5, -1, 2 ** 32, Number.NaN]) {
      expect(() => createSeededRandom(seed)).toThrow()
    }
  })
})
