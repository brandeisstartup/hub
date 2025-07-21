import { defineConfig } from "cypress";

export default defineConfig({
  // e2e: {
  //   setupNodeEvents(on, config) {
  //     // implement node event listeners here
  //   }
  // },
  e2e: {
    // tell Cypress to hit your Next.js dev server
    baseUrl: "http://localhost:3000",
    // where your specs live
    specPattern: "cypress/e2e/**/*.cy.{js,ts,jsx,tsx}",
    supportFile: "cypress/support/e2e.ts"
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack"
    }
  }
});
