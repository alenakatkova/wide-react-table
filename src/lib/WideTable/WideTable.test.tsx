import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WideTable } from './WideTable'
import type { WideTableColumn } from './types'

interface TestRow {
  id: number
  name: string
  age: number
}

const columns: WideTableColumn<TestRow>[] = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: 'Name' },
  { key: 'age', title: 'Age' },
]

const rows: TestRow[] = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
]

describe('WideTable', () => {
  it('renders the table headers and rows', () => {
    render(<WideTable<TestRow> columns={columns} rows={rows} getRowKey={(row) => row.id} />)

    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'ID' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Age' })).toBeInTheDocument()
    expect(screen.getByRole('row', { name: /Alice/ })).toBeInTheDocument()
    expect(screen.getByRole('row', { name: /Bob/ })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '1' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Alice' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '30' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '2' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Bob' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '25' })).toBeInTheDocument()
  })
})
