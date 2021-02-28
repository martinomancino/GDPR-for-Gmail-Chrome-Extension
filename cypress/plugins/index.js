/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on("before:browser:launch", (browser, launchOptions) => {
    // supply the absolute path to an unpacked extension's folder
    // NOTE: extensions cannot be loaded in headless Chrome
    launchOptions.extensions.push(
      "Users/martino.mancino/Documents/Dissertation/GdprForGmail/build"
    );

    return launchOptions;
  });
};

const path = require("path");

module.exports = (on) => {
  on("task", {
    setUrlPath(url) {
      console.log(url);
      filepath = url;
      return null;
    },
  });
};

let filepath = "mocks/gmail.html";
const express = require("express");

const PORT = 443;

const app = express();
const selfSignedHttps = require("self-signed-https");

app.get("/*", (req, res) => {
  return res.sendFile(filepath, { root: __dirname });
});

selfSignedHttps(app).listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
