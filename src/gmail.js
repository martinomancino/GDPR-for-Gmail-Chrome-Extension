/* eslint-disable no-undef */
import $ from "jquery";
import Cookies from "js-cookie";
import initialiseHighlighter from "./highlighter";
import { gmailContainerSelector, gmailTextAreaSelector } from "./constants";

let initialised = false;

let isExtentionEnabled = Cookies.get("gdpr-for-gmail-enabled")
  ? JSON.parse(Cookies.get("gdpr-for-gmail-enabled"))
  : false;

var initialisation = setInterval(() => {
  checkComposeEmailOpened();
}, 500);

function checkComposeEmailOpened() {
  const container = $(gmailContainerSelector).length > 0;
  const textarea = $(gmailTextAreaSelector).length > 0;

  if (container && textarea && !initialised && isExtentionEnabled) {
    initialiseHighlighter($(gmailContainerSelector));
    initialised = true;
    stopCheck();
  }
}

function stopCheck() {
  clearInterval(initialisation);
}
