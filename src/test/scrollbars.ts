import { onTestFinished } from 'vitest'

// Headless Chromium and WebKit on macOS follow the system setting and show overlay scroll bars, which take no space.
// CSS gives them the same scroll bars on every system. Playwright's Firefox hides its scroll bars with a browser rule
// that page CSS cannot override, so Firefox scroll bars always take no space, and a test cannot choose the mode.
export function canChooseScrollbarMode() {
  return CSS.supports('selector(::-webkit-scrollbar)')
}

const classicScrollbarSize = '15px'
const classicScrollbarStyleId = 'imitated-classic-scrollbars'
export const overlayScrollbarStyleId = 'imitated-overlay-scrollbars'

function addStyle(css: string) {
  const style = document.createElement('style')
  style.textContent = css
  document.head.append(style)
  return style
}

export function imitateClassicScrollbars() {
  if (document.getElementById(classicScrollbarStyleId)) return

  const style = addStyle(`
    ::-webkit-scrollbar { width: ${classicScrollbarSize}; height: ${classicScrollbarSize}; }
    ::-webkit-scrollbar-thumb { background: #999; }
  `)
  style.id = classicScrollbarStyleId
}

// For the current test only. In Chromium and WebKit, `scrollbar-width` wins over `::-webkit-scrollbar` styles.
// `!important`, because the `*` selector would lose to any other rule that sets `scrollbar-width`.
export function imitateOverlayScrollbars() {
  const style = addStyle('* { scrollbar-width: none !important; }')
  style.id = overlayScrollbarStyleId
  onTestFinished(() => style.remove())
}
