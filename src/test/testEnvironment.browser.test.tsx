import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WideTable, type WideTableColumn } from '../lib'
import { expectNoAccessibilityViolations } from './accessibility'

interface Row {
  id: number
  name: string
}

describe('browser test environment', () => {
  it('FEAT-004: browser tests run in a real browser', () => {
    // Chromium and WebKit both have "Safari" in their user agent. jsdom and Node do not.
    expect(navigator.userAgent).toContain('Safari')
  })

  it('FEAT-004: reads the real size of a rendered element', async () => {
    const columns: WideTableColumn<Row>[] = [
      { key: 'id', title: 'ID', width: 100 },
      { key: 'name', title: 'Name', width: 150 },
    ]

    const { container } = render(
      <WideTable columns={columns} rows={[{ id: 1, name: 'First' }]} getRowKey={(row) => row.id} />,
    )

    // The table itself gets its width as an inline style, but the header cell widths come from the real layout
    const headerCellWidths = screen
      .getAllByRole('columnheader')
      .map((headerCell) => headerCell.getBoundingClientRect().width)
    expect(headerCellWidths).toEqual([100, 150])
    await expectNoAccessibilityViolations(container)
  })
})
