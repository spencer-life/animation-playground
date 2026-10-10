import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: true,
  workers: 3,
  retries: 0,
  reporter: [['list'], ['json',{outputFile:'test-results/results.json'}]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
    viewport: {width:1440,height:1000},
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? {
      executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
      args:['--no-sandbox','--disable-dev-shm-usage'],
    } : {},
    trace: 'retain-on-failure',
  },
  webServer: {command:'node scripts/serve.mjs',port:4173,reuseExistingServer:!process.env.CI},
});
