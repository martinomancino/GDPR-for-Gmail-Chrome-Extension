/* eslint-disable no-undef */
import $ from "jquery";
import Cookies from "js-cookie";
import initialiseHighlighter from "./highlighter";

const containerSelector = ".Ar.Au";
const textAreaSelector = ".AD .iN .Am.Al";
let initialised = false;

let isExtentionEnabled = Cookies.get("gdpr-for-gmail-enabled")
  ? JSON.parse(Cookies.get("gdpr-for-gmail-enabled"))
  : false;

var initialisation = setInterval(() => {
  checkComposeEmailOpened();
}, 500);

function checkComposeEmailOpened() {
  const container = $(containerSelector).length > 0;
  const textarea = $(textAreaSelector).length > 0;

  if (container && textarea && !initialised && isExtentionEnabled) {
    initialiseHighlighter($(containerSelector));
    initialised = true;
    stopCheck();
  }
}

function stopCheck() {
  clearInterval(initialisation);
}
