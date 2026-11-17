import type { MeasurementResult } from './measure.ts'

export interface MeasurementRow extends MeasurementResult {
  name: string
  passed: boolean
}

export interface MachineInfo {
  cpuModel: string
  memoryGb: number
}

function formatValue(value: number | undefined, unit: string) {
  return value === undefined ? '-' : `${Number(value.toFixed(1))} ${unit}`
}

/** Makes the text table that `pnpm bench` prints after all measurements. */
export function formatResultTable(rows: MeasurementRow[], machine: MachineInfo) {
  const header = ['Measurement', 'Median', 'Goal', 'Result']
  const cells = rows.map((row) => [
    row.name,
    formatValue(row.median, row.unit),
    formatValue(row.goal, row.unit),
    row.passed ? 'pass' : 'fail',
  ])
  const columnWidths = header.map((title, columnIndex) =>
    Math.max(title.length, ...cells.map((rowCells) => rowCells[columnIndex].length)),
  )
  const formatLine = (lineCells: string[]) =>
    lineCells
      .map((cell, columnIndex) => cell.padEnd(columnWidths[columnIndex]))
      .join('  ')
      .trimEnd()

  return [
    `Machine: ${machine.cpuModel}, ${machine.memoryGb} GB memory`,
    '',
    formatLine(header),
    ...cells.map(formatLine),
  ].join('\n')
}
