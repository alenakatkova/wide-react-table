import './WideTable.css'
import type { WideTableProps } from './types'
import { useOverlayScrollbarSpace } from './useOverlayScrollbarSpace'
import { useRef, type ReactNode } from 'react'

const DEFAULT_COLUMN_WIDTH = 100

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

export function WideTable<T>(props: WideTableProps<T>) {
  // A table with no columns has no width, so only the container border would show
  if (props.columns.length === 0) {
    return (
      <div className="wide-table-container">
        <p className="wide-table-empty-message">No columns</p>
      </div>
    )
  }

  // A separate component, so that the scroll bar measuring starts again when the table
  // replaces the message
  return <ScrollableTable {...props} />
}

function ScrollableTable<T>({
  columns,
  rows,
  getRowKey,
  defaultColumnWidth = DEFAULT_COLUMN_WIDTH,
  maxVisibleHeight,
}: WideTableProps<T>) {
  const columnWidths = columns.map((column) => column.width ?? defaultColumnWidth)
  const tableWidth = columnWidths.reduce((totalWidth, width) => totalWidth + width, 0)
  const hasMaxHeight = maxVisibleHeight !== undefined

  const containerRef = useRef<HTMLDivElement>(null)
  const overlayScrollbarSpace = useOverlayScrollbarSpace(containerRef)

  const containerClassName = [
    'wide-table-container',
    hasMaxHeight && 'wide-table-container--max-height',
    overlayScrollbarSpace.right && 'wide-table-container--overlay-scrollbar-right',
    overlayScrollbarSpace.bottom && 'wide-table-container--overlay-scrollbar-bottom',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div ref={containerRef} className={containerClassName} style={{ maxHeight: maxVisibleHeight }}>
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
