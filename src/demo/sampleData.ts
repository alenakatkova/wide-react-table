import type { WideTableColumn } from '../lib'

export interface TradingSession {
  id: string
  date: string
  instrument: string
  open: number
  close: number
  high: number
  low: number
  volume: number
  delta: number
  comment?: string
}

export const sampleColumns: WideTableColumn<TradingSession>[] = [
  { key: 'id', title: 'ID', width: 75 },
  { key: 'date', title: 'Date', width: 150 },
  { key: 'instrument', title: 'Instrument', width: 150 },
  { key: 'open', title: 'Open' },
  { key: 'close', title: 'Close' },
  { key: 'high', title: 'High' },
  { key: 'low', title: 'Low' },
  { key: 'volume', title: 'Volume' },
  { key: 'delta', title: 'Delta' },
  { key: 'comment', title: 'Comment', width: 300 },
] satisfies readonly WideTableColumn<TradingSession>[]

const handwrittenRows: TradingSession[] = [
  {
    id: '1',
    date: '2023-01-01',
    instrument: 'AAPL',
    open: 100,
    close: 110,
    high: 115,
    low: 95,
    volume: 1000,
    delta: 10,
    comment: 'This is a sample comment for the first trading session.',
  },
  {
    id: '2',
    date: '2023-01-02',
    instrument: 'AAPL',
    open: 110,
    close: 120,
    high: 125,
    low: 105,
    volume: 1500,
    delta: 10,
  },
  {
    id: '3',
    date: '2023-01-03',
    instrument: 'AAPL',
    open: 120,
    close: 130,
    high: 135,
    low: 115,
    volume: 2000,
    delta: 10,
    comment:
      'This is a sample longer comment for the third trading session. It is intentionally verbose to test how the table handles longer text content in a cell. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
]

/** Extra rows so the demo overflows `maxVisibleHeight` and scrolls vertically. */
function generateRows(count: number, startId: number): TradingSession[] {
  return Array.from({ length: count }, (_, index) => {
    const id = startId + index

    return {
      id: String(id),
      date: `2023-01-${String(id).padStart(2, '0')}`,
      instrument: 'AAPL',
      open: 130 + index * 10,
      close: 140 + index * 10,
      high: 145 + index * 10,
      low: 125 + index * 10,
      volume: 1000 + index * 500,
      delta: 10,
    }
  })
}

export const sampleRows: TradingSession[] = [
  ...handwrittenRows,
  ...generateRows(15, handwrittenRows.length + 1),
]
