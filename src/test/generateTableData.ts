import type { WideTableColumn } from '../lib'
import { createSeededRandom } from './seededRandom'

export type GeneratedCellValue = string | number | null

export interface GeneratedRow {
  id: number
  [columnKey: string]: GeneratedCellValue
}

type ColumnKind = 'text' | 'number' | 'date'

const columnKinds: ColumnKind[] = ['text', 'number', 'date']
const emptyCellShare = 0.1

// Cells pick their text and dates from fixed lists, so that they share the same strings.
// At the scale goal of 500 columns × 100,000 rows, a new string for each cell would use much more memory.
const textValues = [
  'Alpha',
  'Bravo',
  'Charlie',
  'Delta',
  'Echo',
  'A longer text value that does not fit into a narrow column',
  'Ünïcödé text',
  '',
]
const dateValues = createDateValues(new Date(Date.UTC(2020, 0, 1)), 5 * 365)

function createDateValues(firstDate: Date, dayCount: number) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  return Array.from({ length: dayCount }, (_, dayIndex) =>
    new Date(firstDate.getTime() + dayIndex * millisecondsPerDay).toISOString().slice(0, 10),
  )
}

function pickFrom<Value>(values: readonly Value[], random: () => number): Value {
  return values[Math.floor(random() * values.length)]
}

function createCellValue(kind: ColumnKind, random: () => number): GeneratedCellValue {
  if (random() < emptyCellShare) return null
  if (kind === 'text') return pickFrom(textValues, random)
  if (kind === 'date') return pickFrom(dateValues, random)
  return Math.round((random() - 0.5) * 2_000_000) / 100
}

/**
 * Makes columns and rows for `WideTable` tests and the benchmark. Columns take turns being text,
 * number and date columns, and about one cell in ten is empty (`null`). The same seed always
 * gives the same data.
 */
export function generateTableData(options: {
  columnCount: number
  rowCount: number
  seed: number
}): { columns: WideTableColumn<GeneratedRow>[]; rows: GeneratedRow[] } {
  const random = createSeededRandom(options.seed)
  const columnDefinitions = Array.from({ length: options.columnCount }, (_, columnIndex) => {
    const kind = columnKinds[columnIndex % columnKinds.length]
    return { key: `column${columnIndex + 1}`, title: `Column ${columnIndex + 1} (${kind})`, kind }
  })

  const rows = Array.from({ length: options.rowCount }, (_, rowIndex) => {
    const row: GeneratedRow = { id: rowIndex + 1 }
    for (const column of columnDefinitions) {
      row[column.key] = createCellValue(column.kind, random)
    }
    return row
  })

  const columns = columnDefinitions.map(({ key, title }) => ({ key, title }))
  return { columns, rows }
}
