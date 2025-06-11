import { defineConfig, devices } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config()

const baseURL = process.env.BASE_URL || 'https://us.shop.realmadrid.com/'

export default defineConfig({
  timeout: 120000,
  testDir: 'specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 2,
  workers: process.env.CI ? 4 : undefined,
  reporter: [['html'], ['./custom-reporter.ts']],

  use: {
    actionTimeout: 30_000,
    trace: 'on-first-retry',
    baseURL: baseURL,
  },

  projects: [
    {
      name: 'Desktop Chrome',
      testMatch: 'desktopUI/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'Desktop Firefox',
    //   testMatch: 'desktopUI/**/*.spec.ts',
    //   use: { ...devices['Desktop Firefox'] ,
    //     actionTimeout: 45000,
    //     navigationTimeout: 60000,},
    // },
    // {
    //   name: 'Desktop WebKit',
    //   testMatch: 'desktopUI/**/*.spec.ts',
    //   use: { ...devices['Desktop WebKit'] ,
    //     actionTimeout: 45000,
    //     navigationTimeout: 60000,},
    //     timeout: 150000,
    // },
    {
      name: 'Mobile Chrome',
      testMatch: 'mobileUI/**/*.spec.ts',
      use: { ...devices['Pixel 7'] },
    },
    // {
    //   name: 'Mobile Safari',
    //   testMatch: 'mobileUI/**/*.spec.ts',
    //   use: { ...devices['iPhone 12'] },
    // },
    {
      name: 'API',
      use: { ...devices['Desktop Chrome'] },
      testMatch: 'apiSpecs/**/*.spec.ts',
    },
    {
      name: 'Admin UI',
      testMatch: 'adminUI/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
