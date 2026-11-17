import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { assertGoalMet, measurementRunCount, runMeasurement } from './measure'

function createRunThatGives(values: number[]) {
  const remainingValues = [...values]
  let callCount = 0
  const run = () => {
    callCount++
    return Promise.resolve(remainingValues.shift() ?? Number.NaN)
  }
  return { run, getCallCount: () => callCount }
}

describe('measurement', () => {
  it('FEAT-004: the result is the median of 5 runs', async () => {
    const { run, getCallCount } = createRunThatGives([50, 10, 40, 20, 30])

    await expect(runMeasurement({ run })).resolves.toBe(30)
    expect(measurementRunCount).toBe(5)
    expect(getCallCount()).toBe(5)
  })

  it('FEAT-004: the median of an even number of runs is the middle of the two middle values', async () => {
    const { run } = createRunThatGives([40, 10, 30, 20])

    await expect(runMeasurement({ run, runCount: 4 })).resolves.toBe(25)
  })

  it('FEAT-004: a missed goal fails the measurement', () => {
    expect(() => assertGoalMet({ goal: 500, unit: 'ms', median: 501 })).toThrow()
  })

  it('FEAT-004: a median equal to the goal meets it', () => {
    expect(() => assertGoalMet({ goal: 5, unit: '%', median: 5 })).not.toThrow()
  })

  it('FEAT-004: a measurement that runs too long is stopped and fails', async () => {
    vi.useFakeTimers()
    onTestFinished(() => {
      vi.useRealTimers()
    })
    let callCount = 0
    const slowRun = () => {
      callCount++
      return new Promise<number>((resolve) => setTimeout(() => resolve(1), 30))
    }

    const measurement = expect(runMeasurement({ run: slowRun, timeLimitMs: 50 })).rejects.toThrow()
    // The stop comes during the second run. The time after it lets that run end, so that a third run
    // would start if the stop did not prevent it.
    await vi.advanceTimersByTimeAsync(200)
    await measurement
    expect(callCount).toBe(2)
  })

  it('FEAT-004: a measurement that runs too long tells its running run to stop', async () => {
    vi.useFakeTimers()
    onTestFinished(() => {
      vi.useRealTimers()
    })
    const runSignals: AbortSignal[] = []
    const runThatNeverEnds = (signal: AbortSignal) => {
      runSignals.push(signal)
      return new Promise<number>(() => {})
    }

    const measurement = expect(
      runMeasurement({ run: runThatNeverEnds, timeLimitMs: 50 }),
    ).rejects.toThrow()
    await vi.advanceTimersByTimeAsync(50)
    await measurement
    expect(runSignals).toHaveLength(1)
    expect(runSignals[0].aborted).toBe(true)
  })
})
