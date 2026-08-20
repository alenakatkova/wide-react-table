import type { Key } from 'react'

export interface WideTableColumn<T> {
  key: Extract<keyof T, string>
  title: string
  width?: number
}

export interface WideTableProps<T> {
  columns: readonly WideTableColumn<T>[]
  rows: readonly T[]
  getRowKey: (row: T) => Key
}
