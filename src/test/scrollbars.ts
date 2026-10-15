import { onTestFinished } from 'vitest'

// Headless Chromium and WebKit on macOS follow the system setting and show overlay scroll bars, which take no space.
// CSS gives them the same scroll bars on every system.

const classicScrollbarSize = '15px'
const classicScrollbarStyleId = 'imitated-classic-scrollbars'
export const overlayScrollbarStyleId = 'imitated-overlay-scrollbars'

function addStyleOnce(id: string, css: string) {
  if (document.getElementById(id)) return

  const style = document.createElement('style')
  style.id = id
  style.textContent = css
  document.head.append(style)
}

export function imitateClassicScrollbars() {
  addStyleOnce(
    classicScrollbarStyleId,
    `
    ::-webkit-scrollbar { width: ${classicScrollbarSize}; height: ${classicScrollbarSize}; }
    ::-webkit-scrollbar-thumb { background: #999; }
  `,
  )
}

// For the current test only, so call it inside a test, not in `beforeAll` or at the top of a file:
// the cleanup is registered with `onTestFinished`, which needs a running test.
// Where `scrollbar-width` is set, Chromium and WebKit do not use `::-webkit-scrollbar` styles.
// `!important`, so that no other rule for `scrollbar-width` can change it: the `*` selector has the lowest priority.
export function imitateOverlayScrollbars() {
  // Registered before the style is added, so a call outside a test fails without leaving the style behind.
  // Registered even when the style is already there, so the style never stays after the test.
  onTestFinished(() => document.getElementById(overlayScrollbarStyleId)?.remove())
  addStyleOnce(overlayScrollbarStyleId, '* { scrollbar-width: none !important; }')
}
