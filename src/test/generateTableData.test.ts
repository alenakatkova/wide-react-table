import { describe, expect, it } from 'vitest'
import { generateTableData, type GeneratedCellValue } from './generateTableData'

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/

function cellKind(value: GeneratedCellValue) {
  if (value === null) return 'empty'
  if (typeof value === 'number') return 'number'
  return isoDatePattern.test(value) ? 'date' : 'text'
}

describe('test data generator', () => {
  it('FEAT-004: makes the requested columns and rows with text, numbers, dates and empty values', () => {
    const { columns, rows } = generateTableData({ columnCount: 6, rowCount: 200, seed: 1 })

    expect(columns).toHaveLength(6)
    expect(rows).toHaveLength(200)
    const kinds = new Set(rows.flatMap((row) => columns.map((column) => cellKind(row[column.key]))))
    expect(kinds).toEqual(new Set(['text', 'number', 'date', 'empty']))
  })

  it('FEAT-004: gives all values of one column the same kind', () => {
    const { columns, rows } = generateTableData({ columnCount: 6, rowCount: 200, seed: 1 })

    for (const column of columns) {
      const kinds = new Set(
        rows.map((row) => cellKind(row[column.key])).filter((kind) => kind !== 'empty'),
      )
      expect(kinds.size).toBe(1)
    }
  })

  it('FEAT-004: gives every number a fractional part', () => {
    const { columns, rows } = generateTableData({ columnCount: 6, rowCount: 1_000, seed: 1 })

    const numbers = rows
      .flatMap((row) => columns.map((column) => row[column.key]))
      .filter((value) => typeof value === 'number')
    expect(numbers.length).toBeGreaterThan(0)
    // `Number.isInteger(-0)` is also true, so this also finds -0
    expect(numbers.filter((value) => Number.isInteger(value))).toEqual([])
  })

  it('FEAT-004: puts empty strings into text columns', () => {
    const { columns, rows } = generateTableData({ columnCount: 6, rowCount: 200, seed: 1 })

    const cells = rows.flatMap((row) => columns.map((column) => row[column.key]))
    expect(cells).toContain('')
  })

  it('FEAT-004: gives each row its own id', () => {
    const { rows } = generateTableData({ columnCount: 3, rowCount: 200, seed: 1 })

    expect(new Set(rows.map((row) => row.id)).size).toBe(200)
  })

  it('FEAT-004: makes no columns and no rows when asked for none', () => {
    expect(generateTableData({ columnCount: 0, rowCount: 0, seed: 1 })).toEqual({
      columns: [],
      rows: [],
    })
  })

  it('FEAT-004: makes one column and one row when asked for one', () => {
    const { columns, rows } = generateTableData({ columnCount: 1, rowCount: 1, seed: 1 })

    expect(columns).toHaveLength(1)
    expect(rows).toHaveLength(1)
  })

  it('FEAT-004: rejects a column or row count that is not a whole number of 0 or more', () => {
    for (const count of [-1, 2.5, Number.NaN]) {
      expect(() => generateTableData({ columnCount: count, rowCount: 1, seed: 1 })).toThrow()
      expect(() => generateTableData({ columnCount: 1, rowCount: count, seed: 1 })).toThrow()
    }
  })

  it('FEAT-004: same seed gives the same data', () => {
    const options = { columnCount: 6, rowCount: 50, seed: 7 }

    expect(generateTableData(options)).toEqual(generateTableData(options))
  })

  it('FEAT-004: different seed gives different data', () => {
    const firstData = generateTableData({ columnCount: 6, rowCount: 50, seed: 7 })
    const secondData = generateTableData({ columnCount: 6, rowCount: 50, seed: 8 })

    expect(firstData.rows).not.toEqual(secondData.rows)
  })
})
