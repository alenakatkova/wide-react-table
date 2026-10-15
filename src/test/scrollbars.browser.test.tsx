import { render, screen } from '@testing-library/react'
import { describe, expect, it, onTestFinished } from 'vitest'
import {
  measureScrollbarSizes,
  OVERLAY_SCROLLBAR_MAX_SIZE,
} from '../lib/WideTable/useOverlayScrollbarSpace'
import { imitateOverlayScrollbars, overlayScrollbarStyleId } from './scrollbars'

function renderScrollingContainer() {
  render(
    <div
      data-testid="scrolling-container"
      style={{ width: 200, height: 100, overflow: 'auto', border: '1px solid' }}
    >
      <div style={{ width: 400, height: 300 }} />
    </div>,
  )
  return screen.getByTestId('scrolling-container')
}

describe('scroll bars in browser tests', () => {
  it('FEAT-004: overlay scroll bars take no space', () => {
    imitateOverlayScrollbars()
    const container = renderScrollingContainer()

    expect(measureScrollbarSizes(container).verticalScrollbarWidth).toBeLessThanOrEqual(
      OVERLAY_SCROLLBAR_MAX_SIZE,
    )
  })

  it('FEAT-004: classic scroll bars take space', () => {
    const container = renderScrollingContainer()

    expect(measureScrollbarSizes(container).verticalScrollbarWidth).toBeGreaterThan(
      OVERLAY_SCROLLBAR_MAX_SIZE,
    )
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
