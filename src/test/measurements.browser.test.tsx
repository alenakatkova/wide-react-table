import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  getRenderedTopElement,
  measureDroppedFramesWhileScrolling,
  measureFirstRenderTime,
} from './measurements'

const scrollBox = (
  <div data-testid="scroll-box" style={{ width: 200, height: 100, overflow: 'auto' }}>
    <div style={{ width: 200, height: 1_000 }} />
  </div>
)

function blockPage(durationMs: number) {
  const endTime = performance.now() + durationMs
  while (performance.now() < endTime) {
    // Keeps the page busy, like a slow layout
  }
}

// The scroll step to the end keeps the page busy, as if the browser needed long to draw it. A scroll
// handler cannot do this: the browser runs it only in the frame after the scroll step.
function findScrollBoxWithSlowLastScrollStep(renderContainer: HTMLElement) {
  const box = getRenderedTopElement(renderContainer)
  const scrollTopSetter = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollTop')?.set
  Object.defineProperty(box, 'scrollTop', {
    set: (value: number) => {
      scrollTopSetter?.call(box, value)
      if (value >= box.scrollHeight - box.clientHeight) {
        blockPage(100)
      }
    },
  })
  return box
}

describe('measurements', () => {
  // Without the stop, the scroll takes 60 seconds, so the time limit of 2 seconds fails the test
  it('FEAT-004: a stopped scroll measurement ends before its scroll time', async () => {
    const stopController = new AbortController()
    const measurement = measureDroppedFramesWhileScrolling({
      element: scrollBox,
      findScrollContainer: getRenderedTopElement,
      direction: 'down',
      durationMs: 60_000,
      signal: stopController.signal,
    })
    await vi.waitFor(() => {
      expect(screen.getByTestId('scroll-box').scrollTop).toBeGreaterThan(0)
    })

    stopController.abort()

    await expect(measurement).resolves.toEqual(expect.any(Number))
  }, 2_000)

  it('FEAT-004: a slow last scroll step counts as dropped frames', async () => {
    const droppedFrameShare = await measureDroppedFramesWhileScrolling({
      element: scrollBox,
      findScrollContainer: findScrollBoxWithSlowLastScrollStep,
      direction: 'down',
      durationMs: 300,
      signal: new AbortController().signal,
    })

    // About 6 of about 24 frames are dropped while the page is blocked for 100ms
    expect(droppedFrameShare).toBeGreaterThan(10)
  })

  it('FEAT-004: a scroll measurement removes only its own table', async () => {
    const measurement = measureDroppedFramesWhileScrolling({
      element: scrollBox,
      findScrollContainer: getRenderedTopElement,
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
