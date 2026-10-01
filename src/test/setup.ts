import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// jsdom has no ResizeObserver. Like a browser, the stub reports an element when observation starts.
class ResizeObserverStub implements ResizeObserver {
  private readonly callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe() {
    this.callback([], this)
  }

  unobserve() {}

  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverStub

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
