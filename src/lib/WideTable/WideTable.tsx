import './WideTable.css'
import type { WideTableProps } from './types'
import type { ReactNode } from 'react'

const FALLBACK_DEFAULT_COLUMN_WIDTH = 100

function renderCellValue(value: unknown): ReactNode {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return value
  }

  // fallback for boolean and object values in case they are not handled by the user-defined render function
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

export function WideTable<T>({
  columns,
  rows,
  getRowKey,
  defaultColumnWidth = FALLBACK_DEFAULT_COLUMN_WIDTH,
  maxVisibleHeight,
}: WideTableProps<T>) {
  const columnWidths = columns.map((column) => column.width ?? defaultColumnWidth)
  const tableWidth = columnWidths.reduce((totalWidth, width) => totalWidth + width, 0)
  const isHeightBounded = maxVisibleHeight !== undefined

  const containerClassName = isHeightBounded
    ? 'wide-table-container wide-table-container--bounded'
    : 'wide-table-container'

  return (
    <div className={containerClassName} style={{ maxHeight: maxVisibleHeight }}>
      <table className="wide-table" style={{ width: tableWidth }}>
        <colgroup>
          {columns.map((column, index) => (
            <col key={column.key} style={{ width: columnWidths[index] }} />
          ))}
        </colgroup>

        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((column) => (
                <td key={column.key}>{renderCellValue(row[column.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
