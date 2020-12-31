const GMAIL_URL = "mail.google.com";
const CHROME_TAB = "chrome://";

chrome.tabs.onActivated.addListener(loadInitialiser);

function loadInitialiser() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    const { url, id } = tabs[0];

    if (url.includes(CHROME_TAB)) {
      return;
    }

    if (url.includes(GMAIL_URL)) {
      chrome.tabs.executeScript(null, { file: "static/js/gmail.js" });
      chrome.tabs.insertCSS(id, {
        allFrames: true,
        file: "static/css/gmail.css",
      });
      chrome.browserAction.setIcon({ path: "/icons/icon-48x48.png" });
      chrome.browserAction.setBadgeBackgroundColor({ color: "#002a6d" });
    } else {
      chrome.browserAction.setIcon({ path: "/icons/icon-48x48-bw.png" });
    }
  });
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request.action === "reload") {
    loadInitialiser();
  }
});
