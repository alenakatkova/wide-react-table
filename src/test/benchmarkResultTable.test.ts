import { describe, expect, it } from 'vitest'
import { formatResultTable, type MachineInfo } from './benchmarkResultTable'

const machine: MachineInfo = { cpuModel: 'Test CPU 3000', memoryGb: 16 }

function findLine(table: string, text: string) {
  return table.split('\n').find((line) => line.includes(text))
}

describe('benchmark result table', () => {
  it('FEAT-004: the result table shows name, median, goal, pass or fail, CPU and memory', () => {
    const table = formatResultTable(
      [
        { name: 'FEAT-004: fast measurement', median: 312.46, goal: 500, unit: 'ms', passed: true },
        { name: 'FEAT-004: slow measurement', median: 7.5, goal: 5, unit: '%', passed: false },
      ],
      machine,
    )

    expect(findLine(table, 'FEAT-004: fast measurement')).toMatch(/312\.5 ms\s+500 ms\s+pass/)
    expect(findLine(table, 'FEAT-004: slow measurement')).toMatch(/7\.5 %\s+5 %\s+fail/)
    expect(table).toContain('Test CPU 3000')
    expect(table).toContain('16 GB')
  })

  it('FEAT-004: the result table shows a stopped measurement with no median as failed', () => {
    const table = formatResultTable(
      [{ name: 'FEAT-004: stopped measurement', goal: 500, unit: 'ms', passed: false }],
      machine,
    )

    expect(findLine(table, 'FEAT-004: stopped measurement')).toMatch(/-\s+500 ms\s+fail/)
  })
})
