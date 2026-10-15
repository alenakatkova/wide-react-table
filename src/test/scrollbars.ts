import { onTestFinished } from 'vitest'

// Headless browsers on macOS follow the system setting and show overlay scroll bars, which take no space.
// CSS gives the same scroll bars on every system. Firefox has no CSS for scroll bars that take space.
export const canImitateClassicScrollbars = CSS.supports('selector(::-webkit-scrollbar)')

const classicScrollbarSize = '15px'

function addStyle(css: string) {
  const style = document.createElement('style')
  style.textContent = css
  document.head.append(style)
  return style
}

export function imitateClassicScrollbars() {
  addStyle(`
    ::-webkit-scrollbar { width: ${classicScrollbarSize}; height: ${classicScrollbarSize}; }
    ::-webkit-scrollbar-thumb { background: #999; }
  `)
}

// For the current test only. In Chromium and WebKit, `scrollbar-width` wins over `::-webkit-scrollbar` styles.
export function imitateOverlayScrollbars() {
  const style = addStyle('* { scrollbar-width: none; }')
  onTestFinished(() => style.remove())
}
