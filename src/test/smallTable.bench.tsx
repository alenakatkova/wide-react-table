import { WideTable } from '../lib'
import { generateTableData } from './generateTableData'
import { measure } from './measure'
import { measureDroppedFramesWhileScrolling, measureFirstRenderTime } from './measurements'

// The table has no virtual rendering yet, so it is measured at a small size.
// The full-scale goals come with FEAT-005.
const tableSize = '50 columns x 1,000 rows'

// Not the project's speed goals, which this table misses without virtual rendering (934ms and 11.3%
// dropped frames while scrolling down, measured on one laptop). These goals only catch a large
// slowdown until FEAT-005 sets the project's goals.
const firstRenderGoalMs = 1_500
const droppedFrameGoalPercent = 20

let sharedTableData: ReturnType<typeof generateTableData> | undefined

// Made on first use, so that an error while making it fails a named measurement, not the loading of the file
function createTable() {
  sharedTableData ??= generateTableData({ columnCount: 50, rowCount: 1_000, seed: 1 })
  const { columns, rows } = sharedTableData
  // The height limit makes the table scroll down inside its own container, not the page
  return (
    <WideTable columns={columns} rows={rows} getRowKey={(row) => row.id} maxVisibleHeight={600} />
  )
}

function findTableScrollContainer(renderContainer: HTMLElement) {
  const scrollContainer = renderContainer.firstElementChild
  if (!(scrollContainer instanceof HTMLElement)) {
    throw new Error('The table has no scroll container')
  }
  return scrollContainer
}

measure({
  name: `FEAT-004: first render of ${tableSize}`,
  goal: firstRenderGoalMs,
  unit: 'ms',
  run: () => measureFirstRenderTime(createTable()),
})

for (const direction of ['down', 'right'] as const) {
  measure({
    name: `FEAT-004: dropped frames while scrolling ${direction} through ${tableSize}`,
    goal: droppedFrameGoalPercent,
    unit: '%',
    run: (signal) =>
      measureDroppedFramesWhileScrolling({
        element: createTable(),
        findScrollContainer: findTableScrollContainer,
        direction,
        durationMs: 5_000,
        signal,
      }),
  })
}
