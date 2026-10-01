import './App.css'
import { WideTable, type WideTableColumn } from '../lib'
import {
  fewSampleColumns,
  fewSampleRows,
  sampleColumns,
  sampleRows,
  type TradingSession,
} from './sampleData'

interface Demo {
  id: string
  title: string
  columns: readonly WideTableColumn<TradingSession>[]
  rows: readonly TradingSession[]
  maxVisibleHeight?: number
}

const demos: Demo[] = [
  { id: 'no-rows', title: 'No rows', columns: fewSampleColumns, rows: [] },
  {
    id: 'rows-fit',
    title: 'Rows fit the height',
    columns: fewSampleColumns,
    rows: fewSampleRows,
    maxVisibleHeight: 400,
  },
  {
    id: 'rows-overflow',
    title: 'Rows do not fit the height',
    columns: fewSampleColumns,
    rows: sampleRows,
    maxVisibleHeight: 400,
  },
  { id: 'no-columns', title: 'No columns', columns: [], rows: fewSampleRows },
  {
    id: 'columns-fit',
    title: 'Columns fit the width',
    columns: fewSampleColumns,
    rows: fewSampleRows,
  },
  {
    id: 'columns-overflow',
    title: 'Columns do not fit the width',
    columns: sampleColumns,
    rows: fewSampleRows,
  },
  {
    id: 'rows-and-columns-overflow',
    title: 'Rows and columns do not fit',
    columns: sampleColumns,
    rows: sampleRows,
    maxVisibleHeight: 400,
  },
]

function App() {
  return (
    <main className="app">
      <h1 className="app__title">Wide React Table</h1>
      <p className="app__description">
        A reusable React table component for exploring wide datasets.
      </p>

      {demos.map((demo) => (
        <section key={demo.id} className="app__demo" aria-labelledby={demo.id}>
          <h2 id={demo.id}>{demo.title}</h2>

          <WideTable<TradingSession>
            columns={demo.columns}
            rows={demo.rows}
            getRowKey={(row) => row.id}
            defaultColumnWidth={125}
            maxVisibleHeight={demo.maxVisibleHeight}
          />
        </section>
      ))}
    </main>
  )
}

export default App
