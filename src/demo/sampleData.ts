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
}

export const sampleColumns: WideTableColumn<TradingSession>[] = [
  { key: 'id', title: 'ID', minWidth: 250 },
  { key: 'date', title: 'Date', minWidth: 250 },
  { key: 'instrument', title: 'Instrument', minWidth: 250 },
  { key: 'open', title: 'Open', minWidth: 250 },
  { key: 'close', title: 'Close', minWidth: 250 },
  { key: 'high', title: 'High', minWidth: 250 },
  { key: 'low', title: 'Low', minWidth: 250 },
  { key: 'volume', title: 'Volume', minWidth: 250 },
  { key: 'delta', title: 'Delta', minWidth: 250 },
] satisfies readonly WideTableColumn<TradingSession>[]

export const sampleRows: TradingSession[] = [
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
  },
]
