import os from 'node:os'
import type { Reporter, TestModule } from 'vitest/node'
import { formatResultTable, type MeasurementRow } from './benchmarkResultTable.ts'

/** Prints the result table of all measurements at the end of `pnpm bench`. */
export default class BenchmarkReporter implements Reporter {
  onTestRunEnd(testModules: ReadonlyArray<TestModule>) {
    const rows: MeasurementRow[] = []
    for (const testModule of testModules) {
      for (const testCase of testModule.children.allTests()) {
        const measurement = testCase.meta().measurement
        if (measurement !== undefined) {
          rows.push({
            ...measurement,
            name: testCase.name,
            passed: testCase.result().state === 'passed',
          })
        }
      }
    }

    const machine = {
      cpuModel: os.cpus()[0]?.model ?? 'unknown CPU',
      memoryGb: Math.round(os.totalmem() / 1024 ** 3),
    }
    console.log(`\n${formatResultTable(rows, machine)}\n`)
  }
}
