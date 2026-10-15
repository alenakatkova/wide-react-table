import axe from 'axe-core'

// WCAG 2.2 adds only AA rules to axe, so there is no `wcag22a` tag
const wcagLevelAATags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

function describeViolation(violation: axe.Result) {
  const elements = violation.nodes.map((node) => node.target.join(' ')).join(', ')
  return `${violation.id} (${violation.impact ?? 'unknown impact'}): ${violation.help}. Elements: ${elements}`
}

/**
 * Fails the test when axe finds a WCAG 2.2 level A or AA problem in the element.
 * `disabledRule` turns off one axe rule, for example a known false report in one browser.
 * The test that uses it must say the reason in a code comment.
 */
export async function expectNoAccessibilityViolations(
  element: Element,
  options: { disabledRule?: string } = {},
) {
  const results = await axe.run(element, {
    runOnly: { type: 'tag', values: wcagLevelAATags },
    rules: options.disabledRule ? { [options.disabledRule]: { enabled: false } } : {},
  })

  if (results.violations.length > 0) {
    const violationLines = results.violations.map(
      (violation) => `- ${describeViolation(violation)}`,
    )
    throw new Error(
      `axe found ${results.violations.length} accessibility violations:\n${violationLines.join('\n')}`,
    )
  }
}
