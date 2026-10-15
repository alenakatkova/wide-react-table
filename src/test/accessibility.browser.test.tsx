import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { expectNoAccessibilityViolations } from './accessibility'

describe('accessibility check in browser tests', () => {
  it('FEAT-004: axe check fails for a button with no label', async () => {
    const { container } = render(<button type="button" />)

    await expect(expectNoAccessibilityViolations(container)).rejects.toThrow('button-name')
  })

  it('FEAT-004: axe check passes for UI with no problems', async () => {
    const { container } = render(<button type="button">Save</button>)

    await expect(expectNoAccessibilityViolations(container)).resolves.toBeUndefined()
  })

  it('FEAT-004: axe check skips the turned-off rule and still finds other problems', async () => {
    const { container } = render(
      <>
        <button type="button" />
        <img src="data:," />
      </>,
    )

    const check = expectNoAccessibilityViolations(container, { disabledRule: 'button-name' })

    await expect(check).rejects.toThrow('image-alt')
    await expect(check).rejects.not.toThrow('button-name')
  })
})
