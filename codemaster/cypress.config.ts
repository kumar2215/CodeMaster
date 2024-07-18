import { defineConfig } from "cypress";

export default defineConfig({
  viewportWidth: 1200, // Set your desired viewport width
  viewportHeight: 800, // Set your desired viewport height
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  "chromeWebSecurity": false

});
