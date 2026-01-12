const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '83gs3t',
  retries: 2,
  e2e: {
    baseUrl: "https://qamid.tmweb.ru",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
