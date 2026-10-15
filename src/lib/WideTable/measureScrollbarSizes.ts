/** Up to this size, a measured scroll bar counts as an overlay scroll bar. Allows 1px for rounding. */
export const OVERLAY_SCROLLBAR_MAX_SIZE = 1

function toPixels(value: string): number {
  return parseFloat(value) || 0
}

/**
 * Measures the space that the scroll bars of an element take. A classic scroll bar sits between
 * the border and the padding, so it is the only other part of offsetWidth. An overlay scroll bar
 * takes no space, so its size is 0.
 */
export function measureScrollbarSizes(element: HTMLElement) {
  const { borderLeftWidth, borderRightWidth, borderTopWidth, borderBottomWidth } =
    getComputedStyle(element)

  return {
    verticalScrollbarWidth:
      element.offsetWidth -
      element.clientWidth -
      toPixels(borderLeftWidth) -
      toPixels(borderRightWidth),
    horizontalScrollbarHeight:
      element.offsetHeight -
      element.clientHeight -
      toPixels(borderTopWidth) -
      toPixels(borderBottomWidth),
  }
}
