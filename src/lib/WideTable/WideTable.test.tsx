import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
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

function getContainer(): HTMLElement {
  const container = screen.getByRole('table').parentElement
  if (!container) {
    throw new Error('Table container not found')
  }
  return container
}

function getColWidths(): string[] {
  return Array.from(screen.getByRole('table').querySelectorAll('col')).map((col) => col.style.width)
}

interface ContainerLayout {
  scrollbarSize: number
  overflowsX: boolean
  overflowsY: boolean
}

// Vitest does not load the CSS file, and without it jsdom reports a 16px border
const containerBorder = document.createElement('style')
containerBorder.textContent = '.wide-table-container { border: 1px solid }'
document.head.append(containerBorder)

// jsdom does no layout, so give the container the sizes a browser would report
function mockContainerLayout({ scrollbarSize, overflowsX, overflowsY }: ContainerLayout) {
  const bordersSize = 2
  const sizes = {
    offsetWidth: 200 + scrollbarSize + bordersSize,
    clientWidth: 200,
    scrollWidth: overflowsX ? 500 : 200,
    offsetHeight: 100 + scrollbarSize + bordersSize,
    clientHeight: 100,
    scrollHeight: overflowsY ? 300 : 100,
  }

  for (const [name, size] of Object.entries(sizes)) {
    vi.spyOn(HTMLElement.prototype, name as keyof typeof sizes, 'get').mockImplementation(function (
      this: HTMLElement,
    ) {
      return this.classList.contains('wide-table-container') ? size : 0
    })
  }
}

function renderTable() {
  render(<WideTable<TestRow> columns={columns} rows={rows} getRowKey={(row) => row.id} />)
}

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

  it('shows a message instead of the table when there are no columns', () => {
    render(<WideTable<TestRow> columns={[]} rows={rows} getRowKey={(row) => row.id} />)

    expect(screen.getByText('No columns')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  describe('column widths', () => {
    it('sizes every column with the fallback width when nothing is configured', () => {
      render(<WideTable<TestRow> columns={columns} rows={rows} getRowKey={(row) => row.id} />)

      expect(getColWidths()).toEqual(['100px', '100px', '100px'])
      expect(screen.getByRole('table')).toHaveStyle({ width: '300px' })
    })

    it('uses defaultColumnWidth for columns without an explicit width', () => {
      render(
        <WideTable<TestRow>
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.id}
          defaultColumnWidth={80}
        />,
      )

      expect(getColWidths()).toEqual(['80px', '80px', '80px'])
      expect(screen.getByRole('table')).toHaveStyle({ width: '240px' })
    })

    it('prefers the per-column width and sums it into the table width', () => {
      const sizedColumns: WideTableColumn<TestRow>[] = [
        { key: 'id', title: 'ID', width: 50 },
        { key: 'name', title: 'Name', width: 200 },
        { key: 'age', title: 'Age' },
      ]

      render(
        <WideTable<TestRow>
          columns={sizedColumns}
          rows={rows}
          getRowKey={(row) => row.id}
          defaultColumnWidth={80}
        />,
      )

      expect(getColWidths()).toEqual(['50px', '200px', '80px'])
      expect(screen.getByRole('table')).toHaveStyle({ width: '330px' })
    })
  })

  describe('maxVisibleHeight', () => {
    it('lets the table grow freely when no height is given', () => {
      render(<WideTable<TestRow> columns={columns} rows={rows} getRowKey={(row) => row.id} />)

      const container = getContainer()
      expect(container.style.maxHeight).toBe('')
      expect(container).not.toHaveClass('wide-table-container--bounded')
    })

    it('treats a number as pixels and marks the container as height-bounded', () => {
      render(
        <WideTable<TestRow>
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.id}
          maxVisibleHeight={400}
        />,
      )

      const container = getContainer()
      expect(container).toHaveStyle({ maxHeight: '400px' })
      expect(container).toHaveClass('wide-table-container--bounded')
    })

    it('passes a string height through unchanged', () => {
      render(
        <WideTable<TestRow>
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.id}
          maxVisibleHeight="50vh"
        />,
      )

      // jsdom cannot compute viewport units, so read the inline style directly
      expect(getContainer().style.maxHeight).toBe('50vh')
    })
  })

  describe('overlay scroll bar space', () => {
    it('adds space on the right when an overlay scroll bar scrolls rows', () => {
      mockContainerLayout({ scrollbarSize: 0, overflowsX: false, overflowsY: true })
      renderTable()

      expect(getContainer()).toHaveClass('wide-table-container--space-right')
      expect(getContainer()).not.toHaveClass('wide-table-container--space-bottom')
    })

    it('adds space at the bottom when an overlay scroll bar scrolls columns', () => {
      mockContainerLayout({ scrollbarSize: 0, overflowsX: true, overflowsY: false })
      renderTable()

      expect(getContainer()).toHaveClass('wide-table-container--space-bottom')
      expect(getContainer()).not.toHaveClass('wide-table-container--space-right')
    })

    it('adds no space when classic scroll bars already take space', () => {
      mockContainerLayout({ scrollbarSize: 15, overflowsX: true, overflowsY: true })
      renderTable()

      expect(getContainer()).not.toHaveClass('wide-table-container--space-right')
      expect(getContainer()).not.toHaveClass('wide-table-container--space-bottom')
    })

    it('adds no space when the table does not scroll', () => {
      mockContainerLayout({ scrollbarSize: 0, overflowsX: false, overflowsY: false })
      renderTable()

      expect(getContainer()).not.toHaveClass('wide-table-container--space-right')
      expect(getContainer()).not.toHaveClass('wide-table-container--space-bottom')
    })
  })
})
