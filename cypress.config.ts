import { defineConfig } from "cypress";

const { GoogleSocialLogin } = require("cypress-social-logins").plugins;

export default defineConfig({
  chromeWebSecurity: false,

  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        GoogleSocialLogin: GoogleSocialLogin,
      });
    },
  },
});
