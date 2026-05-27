const { defineConfig, devices } = require("@playwright/test");

// Standardize the BASE_URL environment variable
process.env.BASE_URL = process.env.BASE_URL || "http://localhost:3000";

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: "html",
  timeout: 60000,
  use: {
    baseURL: process.env.BASE_URL,
    trace: "on-first-retry",
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
