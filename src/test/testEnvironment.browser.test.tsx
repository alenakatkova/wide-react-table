import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WideTable, type WideTableColumn } from '../lib'

interface Row {
  id: number
  name: string
}

describe('browser test environment', () => {
  it('FEAT-004: browser tests run in a real browser', () => {
    expect(navigator.userAgent).not.toContain('jsdom')
  })

  it('FEAT-004: reads the real size of a rendered element', () => {
    const columns: WideTableColumn<Row>[] = [
      { key: 'id', title: 'ID', width: 100 },
      { key: 'name', title: 'Name', width: 150 },
    ]

    render(
      <WideTable columns={columns} rows={[{ id: 1, name: 'First' }]} getRowKey={(row) => row.id} />,
    )

    expect(screen.getByRole('table').getBoundingClientRect().width).toBe(250)
  })
})
