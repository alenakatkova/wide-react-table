import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

const browserTestFiles = '**/*.browser.test.{ts,tsx}'
// A pattern, not a list of files, so that a feature adds a measurement without changing this config
const benchmarkFiles = '**/*.bench.tsx'

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
          // The CPU slowdown test slows the whole page, so files that run at the same time would slow
          // each other down, and its own result would change
          fileParallelism: false,
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
      {
        extends: true,
        test: {
          name: 'bench',
          include: [benchmarkFiles],
          setupFiles: ['./src/test/setup.ts', './src/test/setupBenchmark.ts'],
          // The default of 15 seconds would stop a measurement of 5 runs with a 5-second scroll.
          // Above the 60 seconds after which each measurement stops itself, so that its own,
          // clearer message comes first.
          testTimeout: 70_000,
          // Measurement files that run at the same time share the CPU and slow each other down
          fileParallelism: false,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            viewport: { width: 1280, height: 800 },
            // A picture of the page does not explain a missed speed goal
            screenshotFailures: false,
            // Only Chromium can slow down its CPU through its DevTools connection
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
