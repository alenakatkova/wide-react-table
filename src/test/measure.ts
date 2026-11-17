import { test } from 'vitest'

export type MeasurementUnit = 'ms' | '%'

export interface MeasurementResult {
  goal: number
  unit: MeasurementUnit
  // Missing when the measurement was stopped before it had all its runs
  median?: number
}

declare module 'vitest' {
  interface TaskMeta {
    // The reporter reads this to print the result table
    measurement?: MeasurementResult
  }
}

export const measurementRunCount = 5
export const measurementTimeLimitMs = 60_000

function getMedian(values: number[]) {
  const sortedValues = [...values].sort((first, second) => first - second)
  const middle = Math.floor(sortedValues.length / 2)
  return sortedValues.length % 2 === 1
    ? sortedValues[middle]
    : (sortedValues[middle - 1] + sortedValues[middle]) / 2
}

/**
 * Calls `run` several times, one after another, and returns the median of the values that it gives.
 * Rejects when all runs together take longer than `timeLimitMs`, and starts no new run after that.
 */
export async function runMeasurement(options: {
  run: () => Promise<number>
  runCount?: number
  timeLimitMs?: number
}): Promise<number> {
  const runCount = options.runCount ?? measurementRunCount
  const timeLimitMs = options.timeLimitMs ?? measurementTimeLimitMs
  let isStopped = false
  let timeLimitTimer: ReturnType<typeof setTimeout> | undefined

  const timeLimit = new Promise<never>((_, reject) => {
    timeLimitTimer = setTimeout(() => {
      isStopped = true
      reject(new Error(`The measurement was stopped after ${timeLimitMs / 1000} seconds`))
    }, timeLimitMs)
  })

  const allRuns = (async () => {
    const values: number[] = []
    for (let runIndex = 0; runIndex < runCount && !isStopped; runIndex++) {
      values.push(await options.run())
    }
    return getMedian(values)
  })()

  try {
    return await Promise.race([allRuns, timeLimit])
  } finally {
    clearTimeout(timeLimitTimer)
  }
}

/** Fails when the median is higher than the goal. For every measurement, a lower value is better. */
export function assertGoalMet(result: Required<MeasurementResult>) {
  if (result.median > result.goal) {
    throw new Error(
      `The median ${result.median.toFixed(1)}${result.unit} misses the goal of ${result.goal}${result.unit}`,
    )
  }
}

/**
 * Adds a test that runs a measurement 5 times and fails when the median misses the goal.
 * The name must start with the feature id, for example `FEAT-005: first render of 500 columns`.
 * `run` makes one run and gives its value, for example a time in milliseconds.
 */
export function measure(options: {
  name: string
  goal: number
  unit: MeasurementUnit
  run: () => Promise<number>
}) {
  test(options.name, async ({ task }) => {
    const result: MeasurementResult = { goal: options.goal, unit: options.unit }
    task.meta.measurement = result
    result.median = await runMeasurement({ run: options.run })
    assertGoalMet({ ...result, median: result.median })
  })
}
