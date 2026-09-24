import type { Key } from 'react'

export interface WideTableColumn<T> {
  key: Extract<keyof T, string>
  title: string
  /** Fixed column width in pixels. Falls back to `defaultColumnWidth` when omitted. */
  width?: number
}

export interface WideTableProps<T> {
  columns: readonly WideTableColumn<T>[]
  rows: readonly T[]
  getRowKey: (row: T) => Key
  /** Width in pixels for columns that do not define their own `width` */
  defaultColumnWidth?: number
  /**
   * Caps the visible height of the table. A number is treated as pixels, a string is used as-is
   * (for example `'50vh'`). Rows beyond this height scroll vertically inside the table container.
   * When omitted the table grows to fit all rows.
   */
  maxVisibleHeight?: number | string
}
