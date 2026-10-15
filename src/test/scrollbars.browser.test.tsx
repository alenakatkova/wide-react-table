import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  canImitateClassicScrollbars,
  imitateOverlayScrollbars,
  overlayScrollbarStyleId,
  verticalScrollbarWidth,
} from './scrollbars'

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

// The order matters: the second test checks what the first one left behind
describe('scroll bars in browser tests', { shuffle: false }, () => {
  it('FEAT-004: overlay scroll bars take no space', () => {
    imitateOverlayScrollbars()
    const container = renderScrollingContainer()

    expect(verticalScrollbarWidth(container)).toBe(0)
  })

  // Checks the style element, because in Firefox scroll bars take no space with or without it
  it('FEAT-004: overlay scroll bars end with their test', () => {
    expect(document.getElementById(overlayScrollbarStyleId)).toBeNull()
  })

  it.skipIf(!canImitateClassicScrollbars)('FEAT-004: classic scroll bars take space', () => {
    const container = renderScrollingContainer()

    expect(verticalScrollbarWidth(container)).toBeGreaterThan(0)
  })
})
