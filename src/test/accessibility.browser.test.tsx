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

    // `button-name` is turned off to check that the helper skips exactly that rule
    const check = expectNoAccessibilityViolations(container, { disabledRule: 'button-name' })

    await expect(check).rejects.toThrow('image-alt')
    await expect(check).rejects.not.toThrow('button-name')
  })

  it('FEAT-004: axe check fails when the turned-off rule is not one that it runs', async () => {
    const { container } = render(<button type="button">Save</button>)

    // `region` is a best-practice rule, not a WCAG rule, so turning it off here would do nothing
    const check = expectNoAccessibilityViolations(container, { disabledRule: 'region' })

    await expect(check).rejects.toThrow('"region" is not one of the WCAG A and AA rules')
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
