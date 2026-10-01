import { useLayoutEffect, useState, type RefObject } from 'react'

export interface OverlayScrollbarSpace {
  right: boolean
  bottom: boolean
}

const NO_SPACE: OverlayScrollbarSpace = { right: false, bottom: false }

function toPixels(value: string): number {
  return parseFloat(value) || 0
}

function measure(container: HTMLElement): OverlayScrollbarSpace {
  const style = getComputedStyle(container)

  // A classic scroll bar sits between the border and the padding, so it is the only other part
  // of offsetWidth. An overlay scroll bar takes no space, so this is 0. Allow 1px for rounding.
  const scrollbarWidth =
    container.offsetWidth -
    container.clientWidth -
    toPixels(style.borderLeftWidth) -
    toPixels(style.borderRightWidth)
  const scrollbarHeight =
    container.offsetHeight -
    container.clientHeight -
    toPixels(style.borderTopWidth) -
    toPixels(style.borderBottomWidth)

  return {
    right: container.scrollHeight > container.clientHeight && scrollbarWidth <= 1,
    bottom: container.scrollWidth > container.clientWidth && scrollbarHeight <= 1,
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
      const next = measure(container)
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
