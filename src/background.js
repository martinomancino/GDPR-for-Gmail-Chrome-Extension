const GMAIL_URL = "mail.google.com";
const CHROME_TAB = "chrome://";

chrome.tabs.onActivated.addListener((tab) => {
  chrome.tabs.get(tab.tabId, (current_tab_info) => {
    const url = current_tab_info.url;

    if (url.includes(CHROME_TAB)) {
      return;
    }

    if (url.includes(GMAIL_URL)) {
      console.log("Background - Gmail URL");
      chrome.tabs.executeScript(null, { file: "static/js/gmail.js" });
      chrome.tabs.insertCSS(tab.tabId, {
        allFrames: true,
        file: "static/css/gmail.css",
      });
    }
  });
});
