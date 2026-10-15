import { cleanup, render } from '@testing-library/react'
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

  // Only pass or fail is checked, not the message text. A button with no label breaks only the
  // `button-name` rule, and an image with no `alt` text breaks the `image-alt` rule.
  // `button-name` is turned off to check that the helper skips exactly that rule.
  it('FEAT-004: axe check skips the turned-off rule and still finds other problems', async () => {
    const buttonOnly = render(<button type="button" />)
    await expect(
      expectNoAccessibilityViolations(buttonOnly.container, { disabledRule: 'button-name' }),
    ).resolves.toBeUndefined()
    // Two buttons on one page would also break the `target-size` rule
    buttonOnly.unmount()

    const { container } = render(
      <>
        <button type="button" />
        <img src="data:," />
      </>,
    )
    await expect(
      expectNoAccessibilityViolations(container, { disabledRule: 'button-name' }),
    ).rejects.toThrow()
  })

  // The button has no problems, so a failure can only come from the check of `disabledRule`
  it('FEAT-004: axe check fails when the turned-off rule is not one that it runs', async () => {
    const { container } = render(<button type="button">Save</button>)

    // `region` is a best-practice rule, not a WCAG rule, so turning it off here would do nothing
    await expect(
      expectNoAccessibilityViolations(container, { disabledRule: 'region' }),
    ).rejects.toThrow()
    // `css-orientation-lock` has a WCAG tag, but axe does not run it because it is experimental
    await expect(
      expectNoAccessibilityViolations(container, { disabledRule: 'css-orientation-lock' }),
    ).rejects.toThrow()
  })

  it('FEAT-004: axe check fails when the element is no longer on the page', async () => {
    const { container } = render(<button type="button">Save</button>)
    cleanup()

    await expect(expectNoAccessibilityViolations(container)).rejects.toThrow()
  })

  it('FEAT-004: two axe checks started at the same time both give their own result', async () => {
    // An image, not a second button: two small buttons close together break the `target-size` rule
    const { container: containerWithProblem } = render(<img src="data:," />)
    const { container: containerWithoutProblem } = render(<button type="button">Save</button>)

    const checkWithProblem = expectNoAccessibilityViolations(containerWithProblem)
    const checkWithoutProblem = expectNoAccessibilityViolations(containerWithoutProblem)

    await expect(checkWithProblem).rejects.toThrow('image-alt')
    await expect(checkWithoutProblem).resolves.toBeUndefined()
  })
})
