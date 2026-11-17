import { cleanup, render } from '@testing-library/react'
import type { ReactElement } from 'react'

// One frame at 60 frames per second
const frameDurationMs = 1000 / 60

function waitForNextFrame() {
  return new Promise<number>((resolve) => requestAnimationFrame(resolve))
}

// A frame callback runs just before the browser paints, and a timer that it starts runs after the paint
function waitForPaint() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)))
}

/**
 * Gives the share of dropped frames in percent, from the times of the frames that the browser drew.
 * A longer time between two frames counts the frames that fit into it as dropped. The time is rounded
 * to whole frames, so timing noise of less than half a frame drops nothing.
 */
export function getDroppedFrameShare(frameTimes: number[]) {
  let drawnFrameCount = 0
  let droppedFrameCount = 0
  for (let index = 1; index < frameTimes.length; index++) {
    const timeBetweenFrames = frameTimes[index] - frameTimes[index - 1]
    drawnFrameCount++
    droppedFrameCount += Math.max(0, Math.round(timeBetweenFrames / frameDurationMs) - 1)
  }
  const expectedFrameCount = drawnFrameCount + droppedFrameCount
  return expectedFrameCount === 0 ? 0 : (droppedFrameCount / expectedFrameCount) * 100
}

/** Gives the time in milliseconds from the start of the render until the browser has painted it. */
export async function measureFirstRenderTime(element: ReactElement) {
  await waitForPaint()
  const start = performance.now()
  render(element)
  await waitForPaint()
  const renderTime = performance.now() - start
  cleanup()
  return renderTime
}

/**
 * Renders the element, then scrolls its scroll container at a steady speed from the start to the end
 * in `durationMs`, and gives the share of dropped frames in percent.
 */
export async function measureDroppedFramesWhileScrolling(options: {
  element: ReactElement
  findScrollContainer: (renderContainer: HTMLElement) => HTMLElement
  direction: 'down' | 'right'
  durationMs: number
}) {
  const { container } = render(options.element)
  const scrollContainer = options.findScrollContainer(container)
  await waitForPaint()

  const isDown = options.direction === 'down'
  const scrollDistance = isDown
    ? scrollContainer.scrollHeight - scrollContainer.clientHeight
    : scrollContainer.scrollWidth - scrollContainer.clientWidth
  if (scrollDistance <= 0) {
    throw new Error(`The scroll container cannot scroll ${options.direction}`)
  }

  const startTime = await waitForNextFrame()
  const frameTimes = [startTime]
  let progress = 0
  while (progress < 1) {
    const frameTime = await waitForNextFrame()
    frameTimes.push(frameTime)
    progress = Math.min((frameTime - startTime) / options.durationMs, 1)
    if (isDown) {
      scrollContainer.scrollTop = progress * scrollDistance
    } else {
      scrollContainer.scrollLeft = progress * scrollDistance
    }
  }

  cleanup()
  return getDroppedFrameShare(frameTimes)
}
