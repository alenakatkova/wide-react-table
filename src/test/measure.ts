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
 * Calls `run` several times, one after another, and returns the median of the values that the runs
 * return.
 *
 * The median, not the average: other work on the machine, such as garbage collection or another
 * program, can make a run slower, but nothing can make it faster than the code allows. The average
 * counts each slow run in full, so one unlucky run can move it a lot. The median is the middle value
 * after sorting, so one or two unusual runs do not change it. A real slowdown makes every run slower,
 * so it still moves the median.
 *
 * Rejects when all runs together take longer than `timeLimitMs`. Then it starts no new run, and
 * aborts the signal of the running one, which must stop and must not change other elements on the page.
 */
export async function runMeasurement(options: {
  run: (signal: AbortSignal) => Promise<number>
  runCount?: number
  timeLimitMs?: number
}): Promise<number> {
  const runCount = options.runCount ?? measurementRunCount
  const timeLimitMs = options.timeLimitMs ?? measurementTimeLimitMs
  const stopController = new AbortController()
  let timeLimitTimer: ReturnType<typeof setTimeout> | undefined

  const timeLimit = new Promise<never>((_, reject) => {
    timeLimitTimer = setTimeout(() => {
      stopController.abort()
      reject(new Error(`The measurement was stopped after ${timeLimitMs / 1000} seconds`))
    }, timeLimitMs)
  })

  const allRuns = (async () => {
    const values: number[] = []
    for (let runIndex = 0; runIndex < runCount && !stopController.signal.aborted; runIndex++) {
      values.push(await options.run(stopController.signal))
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
 * `run` makes one run and gives its value, for example a time in milliseconds. It stops when its
 * signal is aborted.
 */
export function measure(options: {
  name: string
  goal: number
  unit: MeasurementUnit
  run: (signal: AbortSignal) => Promise<number>
}) {
  test(options.name, async ({ task }) => {
    const result: MeasurementResult = { goal: options.goal, unit: options.unit }
    task.meta.measurement = result
    result.median = await runMeasurement({ run: options.run })
    assertGoalMet({ ...result, median: result.median })
  })
}
