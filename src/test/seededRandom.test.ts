import { describe, expect, it } from 'vitest'
import { createSeededRandom } from './seededRandom'

describe('seeded random numbers', () => {
  it('FEAT-004: seeded random numbers are from 0 up to, but not including, 1', () => {
    const valuesOutOfRange = [0, 1, 7, 2 ** 32 - 1].flatMap((seed) => {
      const random = createSeededRandom(seed)
      return Array.from({ length: 10_000 }, () => random()).filter(
        (value) => value < 0 || value >= 1,
      )
    })

    expect(valuesOutOfRange).toEqual([])
  })

  it('FEAT-004: rejects a seed that is not a whole number from 0 to 2^32 − 1', () => {
    for (const seed of [1.5, -1, 2 ** 32, Number.NaN]) {
      expect(() => createSeededRandom(seed)).toThrow()
    }
  })
})
