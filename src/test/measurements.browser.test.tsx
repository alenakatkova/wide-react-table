import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { measureDroppedFramesWhileScrolling, measureFirstRenderTime } from './measurements'

const scrollBox = (
  <div style={{ width: 200, height: 100, overflow: 'auto' }}>
    <div style={{ width: 200, height: 1_000 }} />
  </div>
)

function findScrollBox(renderContainer: HTMLElement) {
  const scrollContainer = renderContainer.firstElementChild
  if (!(scrollContainer instanceof HTMLElement)) {
    throw new Error('The scroll box was not rendered')
  }
  return scrollContainer
}

describe('measurements', () => {
  // Without the stop, the scroll takes 60 seconds, so the time limit of 2 seconds fails the test
  it('FEAT-004: a stopped scroll measurement ends before its scroll time', async () => {
    const stopController = new AbortController()
    const measurement = measureDroppedFramesWhileScrolling({
      element: scrollBox,
      findScrollContainer: findScrollBox,
      direction: 'down',
      durationMs: 60_000,
      signal: stopController.signal,
    })

    stopController.abort()

    await expect(measurement).resolves.toEqual(expect.any(Number))
  }, 2_000)

  it('FEAT-004: a scroll measurement removes only its own table', async () => {
    const measurement = measureDroppedFramesWhileScrolling({
      element: scrollBox,
      findScrollContainer: findScrollBox,
      direction: 'down',
      durationMs: 100,
      signal: new AbortController().signal,
    })
    render(<p>Rendered by another measurement</p>)

    await measurement

    expect(screen.getByText('Rendered by another measurement')).toBeInTheDocument()
  })

  it('FEAT-004: a first render measurement removes only its own table', async () => {
    const measurement = measureFirstRenderTime(<p>Measured</p>)
    render(<p>Rendered by another measurement</p>)

    await measurement

    expect(screen.getByText('Rendered by another measurement')).toBeInTheDocument()
  })
})
