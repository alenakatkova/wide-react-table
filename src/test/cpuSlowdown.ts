// The Playwright provider adds `send` to the type of `cdp()`
/// <reference types="@vitest/browser-playwright" />
import { cdp } from 'vitest/browser'

/**
 * Makes the page's CPU `rate` times slower, through Chromium's DevTools connection. A rate of 1 is
 * the normal speed. Works only in Chromium.
 */
export async function setCpuSlowdown(rate: number) {
  await cdp().send('Emulation.setCPUThrottlingRate', { rate })
}
