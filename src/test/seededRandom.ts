/**
 * Returns a function that gives numbers from 0 (included) to 1 (not included), like `Math.random`.
 * The same seed always gives the same numbers, so generated test data can be compared between runs.
 * The algorithm is Mulberry32: small and fast, but not for security.
 */
export function createSeededRandom(seed: number): () => number {
  // The algorithm keeps a 32-bit state, so any other seed would give the same numbers as some other seed
  if (!Number.isInteger(seed) || seed < 0 || seed > 2 ** 32 - 1) {
    throw new RangeError(`The seed must be a whole number from 0 to 2^32 − 1, but it is ${seed}`)
  }
  let state = seed

  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let mixed = state
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1)
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }
}
