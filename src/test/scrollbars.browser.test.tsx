import { render, screen } from '@testing-library/react'
import { describe, expect, it, onTestFinished } from 'vitest'
import { imitateOverlayScrollbars, overlayScrollbarStyleId } from './scrollbars'

const containerBorderWidth = 1

function renderScrollingContainer() {
  render(
    <div
      data-testid="scrolling-container"
      style={{
        width: 200,
        height: 100,
        overflow: 'auto',
        border: `${containerBorderWidth}px solid`,
      }}
    >
      <div style={{ width: 400, height: 300 }} />
    </div>,
  )
  return screen.getByTestId('scrolling-container')
}

// Measured here, not with the library's own measurement, so that a bug there cannot hide a problem here
function measureScrollbars(container: HTMLElement) {
  const bordersSize = 2 * containerBorderWidth
  return {
    verticalScrollbarWidth: container.offsetWidth - container.clientWidth - bordersSize,
    horizontalScrollbarHeight: container.offsetHeight - container.clientHeight - bordersSize,
  }
}

describe('scroll bars in browser tests', () => {
  it('FEAT-004: overlay scroll bars take no space', () => {
    imitateOverlayScrollbars()
    const container = renderScrollingContainer()

    expect(measureScrollbars(container)).toEqual({
      verticalScrollbarWidth: 0,
      horizontalScrollbarHeight: 0,
    })
  })

  it('FEAT-004: classic scroll bars take space', () => {
    const container = renderScrollingContainer()

    // WideTable treats a scroll bar of up to 1px as an overlay scroll bar
    const { verticalScrollbarWidth, horizontalScrollbarHeight } = measureScrollbars(container)
    expect(verticalScrollbarWidth).toBeGreaterThan(1)
    expect(horizontalScrollbarHeight).toBeGreaterThan(1)
  })

  it('FEAT-004: choosing overlay scroll bars twice adds one style', () => {
    imitateOverlayScrollbars()
    imitateOverlayScrollbars()

    expect(document.querySelectorAll(`#${overlayScrollbarStyleId}`)).toHaveLength(1)
  })

  it('FEAT-004: overlay scroll bars end with their test', () => {
    // Registered before the helper's own cleanup, so it runs after it: Vitest runs these callbacks in reverse order
    onTestFinished(() => {
      expect(document.getElementById(overlayScrollbarStyleId)).toBeNull()
    })
    imitateOverlayScrollbars()

    expect(document.getElementById(overlayScrollbarStyleId)).not.toBeNull()
  })
})
