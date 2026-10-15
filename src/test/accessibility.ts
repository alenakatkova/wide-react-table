import axe from 'axe-core'

// WCAG 2.2 adds only AA rules to axe, so there is no `wcag22a` tag
const wcagLevelAATags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

// axe cannot run two checks at the same time on one page, so each check waits for the one before it
let lastAccessibilityCheck: Promise<unknown> = Promise.resolve()

function describeViolation(violation: axe.Result) {
  const elements = violation.nodes.map((node) => node.target.join(' ')).join(', ')
  return `${violation.id} (${violation.impact ?? 'unknown impact'}): ${violation.help}. Elements: ${elements}`
}

async function runAccessibilityCheck(element: Element, disabledRule: string | undefined) {
  const results = await axe.run(element, {
    runOnly: { type: 'tag', values: wcagLevelAATags },
    rules: disabledRule ? { [disabledRule]: { enabled: false } } : {},
  })

  // `results.incomplete` is ignored on purpose. It holds cases that axe cannot decide, most often color
  // contrast over a background that axe cannot see. Many of them are fine, so they would fail tests for nothing.
  if (results.violations.length > 0) {
    const violationLines = results.violations.map(
      (violation) => `- ${describeViolation(violation)}`,
    )
    throw new Error(
      `axe found ${results.violations.length} accessibility violations:\n${violationLines.join('\n')}`,
    )
  }
}

/**
 * Fails the test when axe finds a WCAG 2.2 level A or AA problem in the element.
 * `disabledRule` turns off one axe rule, for example a known false report in one browser.
 * The test that uses it must say the reason in a code comment.
 * Only the element and its children are checked. UI that is drawn in a portal, such as a menu in
 * `document.body`, needs its own check.
 */
export function expectNoAccessibilityViolations(
  element: Element,
  options: { disabledRule?: string } = {},
) {
  const check = lastAccessibilityCheck.then(() =>
    runAccessibilityCheck(element, options.disabledRule),
  )
  // A failed check must not stop the checks after it
  lastAccessibilityCheck = check.catch(() => {})
  return check
}
