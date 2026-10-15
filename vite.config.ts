import { configDefaults, defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

const browserTestFiles = '**/*.browser.test.tsx'

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
            // Playwright starts headless Chromium with this flag, which hides scroll bars. Firefox and WebKit do not get it.
            provider: playwright({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } }),
            instances: [{ browser: 'chromium' }, { browser: 'firefox' }, { browser: 'webkit' }],
          },
        },
      },
    ],
  },
})
