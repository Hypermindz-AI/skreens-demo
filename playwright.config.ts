import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: 'demo-script.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'html',
  timeout: 300000, // 5 minutes for the full demo

  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on',
    video: {
      mode: 'on',
      size: { width: 1920, height: 1080 },
    },
    screenshot: 'on',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          slowMo: 100,
        },
      },
    },
  ],

  webServer: {
    command: 'pnpm dev --port 3002',
    url: 'http://localhost:3002',
    reuseExistingServer: true,
    timeout: 120000,
  },
});
