const GMAIL_URL = "mail.google.com";
const CHROME_TAB = "chrome://";

function loadInitialiser() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    const { url } = tabs[0];

    if (url.includes(CHROME_TAB)) {
      return;
    }

    if (url.includes(GMAIL_URL)) {
      chrome.tabs.executeScript(null, { file: "static/js/gmail.js" });
      chrome.browserAction.setIcon({ path: "/icons/icon-48x48.png" });
    }
  });
}

chrome.tabs.onActivated.addListener(loadInitialiser());
chrome.runtime.onMessage.addListener(function (request) {
  if (request.action === "reload") {
    loadInitialiser();
  }
});
