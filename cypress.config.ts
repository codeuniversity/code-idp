import { defineConfig } from 'cypress';

// Populate process.env with values from .env file
require('dotenv').config();

export default defineConfig({
  projectId: 'cf7icg',
  env: {
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },

  e2e: {
    chromeWebSecurity: false,
    experimentalSourceRewriting: false,
    numTestsKeptInMemory: 1,
    defaultCommandTimeout: 30000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    taskTimeout: 30000,
    pageLoadTimeout: 30000,
    screenshotOnRunFailure: true,
    video: false,
    viewportHeight: 1080,
    viewportWidth: 1920,
    waitForAnimations: true,
  },
});
