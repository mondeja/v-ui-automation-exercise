const process = require("process");

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  globalSetup: require.resolve("./tests/setup.js"),
  use: {
    headless: !!process.env.CI,
  },
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["html", { open: "never" }],
  ],
  testDir: "./tests",
};

module.exports = config;
