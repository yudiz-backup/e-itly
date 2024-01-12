import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      // require('cypress-plugin-typescript')(on, config);
      return config;
      // implement node event listeners here
    },
  },
});
