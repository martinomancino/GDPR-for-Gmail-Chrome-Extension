/* eslint-disable no-undef */
/// <reference types="cypress" />

context("Chrome extension", () => {
  // Restore the saved localStorage snapshot prior to each test
  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  // Save the localStorage snapshot after each test
  afterEach(() => {
    cy.saveLocalStorage();
  });

  describe("Popup", () => {
    it("Popup.html", () => {
      cy.visit("/popup.html");
    });
  });
});

describe("App", () => {
  before(() => {
    // Load your popup
    cy.visit("https://mail.google.com/", {
      onBeforeLoad(win) {
        win.chrome = win.chrome || {};
        win.chrome.runtime = {
          sendMessage(message, cb) {
            cb(some_data);
          },
        };
      },
    }).wait(10000);
  });

  it("Popup.html", () => {});
});
