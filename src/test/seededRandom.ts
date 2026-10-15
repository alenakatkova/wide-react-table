/**
 * Returns a function that gives numbers from 0 (included) to 1 (not included), like `Math.random`.
 * The same seed always gives the same numbers, so generated test data can be compared between runs.
 * The algorithm is Mulberry32: small and fast, but not for security.
 */
export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0

  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let mixed = state
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1)
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }
}
