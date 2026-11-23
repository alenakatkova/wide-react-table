import { describe, expect, it, onTestFinished } from 'vitest'
import { server } from 'vitest/browser'
import { setCpuSlowdown } from './cpuSlowdown'

// The same fixed amount of work every time, about 30ms at normal speed on a laptop
function doFixedWork() {
  let total = 0
  for (let index = 0; index < 30_000_000; index++) {
    total += Math.sqrt(index)
  }
  return total
}

// The shortest of three runs, because noise, such as garbage collection, only makes a run longer
function timeFixedWork() {
  const durations = [1, 2, 3].map(() => {
    const start = performance.now()
    doFixedWork()
    return performance.now() - start
  })
  return Math.min(...durations)
}

describe('CPU slowdown', () => {
  // Skipped in WebKit: only Chromium has the DevTools connection that slows the CPU, and the benchmark
  // runs only in Chromium
  it.skipIf(server.browser !== 'chromium')(
    'FEAT-004: CPU slowdown makes the same work take longer',
    async () => {
      onTestFinished(() => setCpuSlowdown(1))
      const normalDuration = timeFixedWork()

      await setCpuSlowdown(2)
      const slowedDuration = timeFixedWork()

      // Twice as long in theory. The lower bound leaves room for timing noise.
      expect(slowedDuration).toBeGreaterThan(normalDuration * 1.5)
    },
  )
})
