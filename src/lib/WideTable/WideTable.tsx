import './WideTable.css'
import type { WideTableProps } from './types'
import type { ReactNode } from 'react'

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

export function WideTable<T>({ columns, rows, getRowKey }: WideTableProps<T>) {
  return (
    <div className="wide-table-container">
      <table className="wide-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={{ width: column.width }} scope="col">
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
