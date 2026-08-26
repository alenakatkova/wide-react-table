import './App.css'
import { WideTable } from '../lib'
import { sampleColumns, sampleRows, type TradingSession } from './sampleData'

function App() {
  return (
    <main className="app">
      <h1 className="app__title">Wide React Table</h1>
      <p className="app__description">
        A reusable React table component for exploring wide datasets.
      </p>
      <section className="app__demo" aria-labelledby="demo-title">
        <h2 id="demo-title">Basic table demo</h2>

        <WideTable<TradingSession>
          columns={sampleColumns}
          rows={sampleRows}
          getRowKey={(row) => row.id}
        />
      </section>
    </main>
  )
}

export default App
