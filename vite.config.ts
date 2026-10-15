import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

const browserTestFiles = '**/*.browser.test.{ts,tsx}'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          exclude: [...configDefaults.exclude, browserTestFiles],
          setupFiles: ['./src/test/setupJsdom.ts', './src/test/setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: [browserTestFiles],
          setupFiles: ['./src/test/setup.ts', './src/test/setupBrowser.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            // Vitest's default page is 414px wide, so a wide table would make the page itself scroll
            viewport: { width: 1280, height: 800 },
            // No Firefox: Playwright's Firefox hides its scroll bars with a rule that page CSS cannot change,
            // so layout tests with scroll bars cannot run there
            instances: [
              {
                browser: 'chromium',
                // Playwright starts headless Chromium with this flag, which hides even the CSS-styled scroll bars.
                // Without this option, `FEAT-004: classic scroll bars take space` fails in Chromium.
                provider: playwright({
                  launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] },
                }),
              },
              { browser: 'webkit' },
            ],
          },
        },
      },
    ],
  },
})
