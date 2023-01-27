const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:4200',
    reporter: "mochawesome",
    reporterOptions: {
      overwrite: false,
      html: false,
      json: true
    }
  },
});
