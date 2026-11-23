import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WideTable, type WideTableColumn, type WideTableProps } from '..'
import { expectNoAccessibilityViolations } from '../../test/accessibility'

type Row = Record<string, string | number>

function expectNoAccessibilityViolationsExceptScrollAreaFocus(element: Element) {
  // Off until FEAT-024 makes the scroll area reachable with the keyboard
  return expectNoAccessibilityViolations(element, { disabledRule: 'scrollable-region-focusable' })
}

function createColumns(count: number): WideTableColumn<Row>[] {
  return Array.from({ length: count }, (_, index) => ({
    key: `column${index}`,
    title: `Column ${index}`,
  }))
}

function createRows(columns: readonly WideTableColumn<Row>[], count: number): Row[] {
  return Array.from({ length: count }, (_, rowIndex) => ({
    id: rowIndex,
    ...Object.fromEntries(columns.map((column) => [column.key, `Value ${rowIndex}`])),
  }))
}

function renderTable(props: Pick<WideTableProps<Row>, 'columns'> & Partial<WideTableProps<Row>>) {
  return render(
    <WideTable<Row> rows={createRows(props.columns, 3)} getRowKey={(row) => row.id} {...props} />,
  )
}

// The element that scrolls is the parent of the table. It has no role of its own until FEAT-024.
function getScrollContainer() {
  const scrollContainer = screen.getByRole('table').parentElement
  if (!scrollContainer) {
    throw new Error('The table has no scroll container')
  }
  return scrollContainer
}

function getHeaderCellWidths() {
  return screen
    .getAllByRole('columnheader')
    .map((headerCell) => headerCell.getBoundingClientRect().width)
}

describe('WideTable layout', () => {
  it('FEAT-001: each column uses its own width or the default width', async () => {
    const { container } = renderTable({
      columns: [
        { key: 'id', title: 'ID', width: 50 },
        { key: 'name', title: 'Name' },
        { key: 'comment', title: 'Comment', width: 200 },
      ],
      defaultColumnWidth: 80,
    })

    expect(getHeaderCellWidths()).toEqual([50, 80, 200])
    await expectNoAccessibilityViolationsExceptScrollAreaFocus(container)
  })

  it('FEAT-001: columns without a width are 100 px wide when no default width is given', async () => {
    const { container } = renderTable({ columns: createColumns(2) })

    expect(getHeaderCellWidths()).toEqual([100, 100])
    await expectNoAccessibilityViolationsExceptScrollAreaFocus(container)
  })

  it('FEAT-001: the table width is the sum of the column widths', async () => {
    const { container } = renderTable({
      columns: [
        { key: 'id', title: 'ID', width: 50 },
        { key: 'name', title: 'Name', width: 200 },
        { key: 'comment', title: 'Comment' },
      ],
      defaultColumnWidth: 80,
    })

    expect(screen.getByRole('table').getBoundingClientRect().width).toBe(50 + 200 + 80)
    await expectNoAccessibilityViolationsExceptScrollAreaFocus(container)
  })

  it('FEAT-001: with maxVisibleHeight in pixels, the rows scroll inside the container', async () => {
    const columns = createColumns(2)
    const { container } = renderTable({
      columns,
      rows: createRows(columns, 50),
      maxVisibleHeight: 200,
    })

    const scrollContainer = getScrollContainer()
    expect(scrollContainer.getBoundingClientRect().height).toBe(200)
    scrollContainer.scrollTop = 100
    expect(scrollContainer.scrollTop).toBe(100)
    await expectNoAccessibilityViolationsExceptScrollAreaFocus(container)
  })

  it('FEAT-001: with maxVisibleHeight as a CSS length, the rows scroll inside the container', async () => {
    const columns = createColumns(2)
    const { container } = renderTable({
      columns,
      rows: createRows(columns, 50),
      maxVisibleHeight: '50vh',
    })

    const scrollContainer = getScrollContainer()
    // The test page is 800 px high
    expect(scrollContainer.getBoundingClientRect().height).toBe(400)
    scrollContainer.scrollTop = 100
    expect(scrollContainer.scrollTop).toBe(100)
    await expectNoAccessibilityViolationsExceptScrollAreaFocus(container)
  })

  it('FEAT-001: the header stays visible while the rows scroll', async () => {
    const columns = createColumns(2)
    const { container } = renderTable({
      columns,
      rows: createRows(columns, 50),
      maxVisibleHeight: 200,
    })

    const scrollContainer = getScrollContainer()
    scrollContainer.scrollTop = 300
    expect(scrollContainer.scrollTop).toBe(300)

    const visibleAreaTop = scrollContainer.getBoundingClientRect().top + scrollContainer.clientTop
    for (const headerCell of screen.getAllByRole('columnheader')) {
      expect(headerCell.getBoundingClientRect().top).toBe(visibleAreaTop)
    }
    await expectNoAccessibilityViolationsExceptScrollAreaFocus(container)
  })

  it('FEAT-001: columns wider than the container scroll right inside it, and the page does not scroll', async () => {
    // 20 columns of 100 px are wider than the test page of 1280 px
    const { container } = renderTable({ columns: createColumns(20) })

    const scrollContainer = getScrollContainer()
    expect(scrollContainer.getBoundingClientRect().right).toBeLessThanOrEqual(window.innerWidth)
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth)
    scrollContainer.scrollLeft = 300
    expect(scrollContainer.scrollLeft).toBe(300)
    await expectNoAccessibilityViolationsExceptScrollAreaFocus(container)
  })

  it('FEAT-001: each header cell stays above its column while the table scrolls right', async () => {
    const { container } = renderTable({ columns: createColumns(20) })

    const scrollContainer = getScrollContainer()
    scrollContainer.scrollLeft = 250
    expect(scrollContainer.scrollLeft).toBe(250)

    const headerCells = screen.getAllByRole('columnheader')
    const firstRowCells = screen.getAllByRole('row')[1].querySelectorAll('td')
    headerCells.forEach((headerCell, columnIndex) => {
      const headerCellBox = headerCell.getBoundingClientRect()
      const bodyCellBox = firstRowCells[columnIndex].getBoundingClientRect()
      const headerCellEdges = [headerCellBox.left, headerCellBox.right]
      expect(headerCellEdges).toEqual([bodyCellBox.left, bodyCellBox.right])
    })
    await expectNoAccessibilityViolationsExceptScrollAreaFocus(container)
  })

  it('FEAT-001: a value longer than its column is cut with an ellipsis, and the column keeps its width', async () => {
    const columns: WideTableColumn<Row>[] = [{ key: 'comment', title: 'Comment', width: 80 }]
    const { container } = renderTable({
      columns,
      rows: [{ id: 1, comment: 'A long comment with spaces that does not fit into its column' }],
    })

    const cell = screen.getByRole('cell')
    expect(cell.scrollWidth).toBeGreaterThan(cell.clientWidth)
    expect(getComputedStyle(cell).textOverflow).toBe('ellipsis')
    expect(getHeaderCellWidths()).toEqual([80])
    await expectNoAccessibilityViolationsExceptScrollAreaFocus(container)
  })
})
