import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { canImitateClassicScrollbars, imitateOverlayScrollbars } from './scrollbars'

function renderScrollingContainer() {
  render(
    <div data-testid="scrolling-container" style={{ width: 200, height: 100, overflow: 'auto' }}>
      <div style={{ width: 400, height: 300 }} />
    </div>,
  )
  return screen.getByTestId('scrolling-container')
}

function verticalScrollbarWidth(element: HTMLElement) {
  return element.offsetWidth - element.clientWidth
}

describe('scroll bars in browser tests', () => {
  it('FEAT-004: overlay scroll bars take no space', () => {
    imitateOverlayScrollbars()
    const container = renderScrollingContainer()

    expect(verticalScrollbarWidth(container)).toBe(0)
  })

  // Runs after the overlay test, so it also fails if overlay scroll bars stay after their test
  it.skipIf(!canImitateClassicScrollbars)('FEAT-004: classic scroll bars take space', () => {
    const container = renderScrollingContainer()

    expect(verticalScrollbarWidth(container)).toBeGreaterThan(0)
  })
})
