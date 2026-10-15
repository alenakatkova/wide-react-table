import type { WideTableColumn } from '../lib'
import { createSeededRandom } from './seededRandom'

export type GeneratedCellValue = string | number | null

export interface GeneratedRow {
  id: number
  [columnKey: string]: GeneratedCellValue
}

type ColumnKind = 'text' | 'number' | 'date'

// Two of every three columns are numbers, like the data this table is made for
const columnKinds: ColumnKind[] = ['text', 'number', 'number', 'date', 'number', 'number']
const emptyCellShare = 0.1

// Text and dates come from fixed lists. After `JSON.parse`, Chrome shares only short strings, about
// 10 characters or fewer (not measured here), so dates and short texts are shared and longer texts
// are not, like real data.
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
  return createDecimalNumber(random)
}

// From -9,999.99 to 9,999.99. The hundredths are never 0, so the number is never whole and never -0.
// Decimals on purpose, like real data, although Chrome needs more memory for them than for whole
// numbers. The benchmark must measure that cost.
function createDecimalNumber(random: () => number) {
  const wholePart = Math.floor(random() * 20_000) - 10_000
  const hundredths = 1 + Math.floor(random() * 99)
  return (wholePart * 100 + hundredths) / 100
}

function assertWholeCount(name: string, count: number) {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError(`${name} must be a whole number of 0 or more, but it is ${count}`)
  }
}

/**
 * Makes columns and rows for `WideTable` tests and the benchmark. Two of every three columns are
 * number columns, the others are text and date columns, and about one cell in ten is `null`.
 * Text columns also have empty strings, so about one text cell in five looks empty.
 * The same seed always gives the same data.
 */
export function generateTableData(options: {
  columnCount: number
  rowCount: number
  seed: number
}): { columns: WideTableColumn<GeneratedRow>[]; rows: GeneratedRow[] } {
  assertWholeCount('columnCount', options.columnCount)
  assertWholeCount('rowCount', options.rowCount)

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
    // Real rows come from a server through `JSON.parse`, and Chrome stores those in a faster form
    // than rows that get their properties added one by one. The benchmark must measure real rows.
    return JSON.parse(JSON.stringify(row)) as GeneratedRow
  })

  const columns = columnDefinitions.map(({ key, title }) => ({ key, title }))
  return { columns, rows }
}
