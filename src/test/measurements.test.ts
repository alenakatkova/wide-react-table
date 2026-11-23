import { describe, expect, it } from 'vitest'
import { getDroppedFrameShare } from './measurements'

const frameDurationMs = 1000 / 60

function createFrameTimes(timesBetweenFrames: number[]) {
  const frameTimes = [0]
  for (const timeBetweenFrames of timesBetweenFrames) {
    frameTimes.push(frameTimes[frameTimes.length - 1] + timeBetweenFrames)
  }
  return frameTimes
}

describe('dropped frames', () => {
  it('FEAT-004: finds no dropped frames when every frame comes on time', () => {
    const frameTimes = createFrameTimes(Array(10).fill(frameDurationMs))

    expect(getDroppedFrameShare(frameTimes)).toBe(0)
  })

  it('FEAT-004: finds no dropped frames in timing noise of less than half a frame', () => {
    const frameTimes = createFrameTimes([frameDurationMs + 5, frameDurationMs - 5, frameDurationMs])

    expect(getDroppedFrameShare(frameTimes)).toBe(0)
  })

  it('FEAT-004: counts every frame that fits into a long time between two frames as dropped', () => {
    // 3 frames on time, then a time of 3 frames: 2 of the 6 expected frames are dropped
    const frameTimes = createFrameTimes([
      frameDurationMs,
      frameDurationMs,
      frameDurationMs,
      3 * frameDurationMs,
    ])

    expect(getDroppedFrameShare(frameTimes)).toBeCloseTo((2 / 6) * 100)
  })

  it('FEAT-004: finds no dropped frames when fewer than two frames were drawn', () => {
    expect(getDroppedFrameShare([])).toBe(0)
    expect(getDroppedFrameShare([0])).toBe(0)
  })
})
