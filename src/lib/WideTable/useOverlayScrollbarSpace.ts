import { useLayoutEffect, useState, type RefObject } from 'react'

export interface OverlayScrollbarSpace {
  right: boolean
  bottom: boolean
}

const NO_SPACE: OverlayScrollbarSpace = { right: false, bottom: false }

function toPixels(value: string): number {
  return parseFloat(value) || 0
}

/** Up to this size, a measured scroll bar counts as an overlay scroll bar. Allows 1px for rounding. */
export const OVERLAY_SCROLLBAR_MAX_SIZE = 1

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

function findOverlayScrollbarSides(container: HTMLElement): OverlayScrollbarSpace {
  const { verticalScrollbarWidth, horizontalScrollbarHeight } = measureScrollbarSizes(container)

  return {
    right:
      container.scrollHeight > container.clientHeight &&
      verticalScrollbarWidth <= OVERLAY_SCROLLBAR_MAX_SIZE,
    bottom:
      container.scrollWidth > container.clientWidth &&
      horizontalScrollbarHeight <= OVERLAY_SCROLLBAR_MAX_SIZE,
  }
}

/**
 * Finds the sides where an overlay scroll bar (the macOS default with a trackpad) is drawn over
 * the content. `scrollbar-gutter` cannot reserve room for these scroll bars, so the container
 * must add the space itself.
 */
export function useOverlayScrollbarSpace(
  containerRef: RefObject<HTMLElement | null>,
): OverlayScrollbarSpace {
  const [space, setSpace] = useState(NO_SPACE)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    // The table is the only child, so a change of its size or of the container size can change
    // whether the container scrolls
    const observer = new ResizeObserver(() => {
      const next = findOverlayScrollbarSides(container)
      setSpace((current) =>
        current.right === next.right && current.bottom === next.bottom ? current : next,
      )
    })
    observer.observe(container)
    if (container.firstElementChild) {
      observer.observe(container.firstElementChild)
    }

    return () => observer.disconnect()
  }, [containerRef])

  return space
}
