/* eslint-disable no-undef */
import $ from "jquery";
import debounce from "debounce";
import Cookies from "js-cookie";
import { predict, loadGraphModel } from "./model";
import { postcodeRegex, phoneNumberRegex, creditCardRegex } from "./constants";

const initialiseHighlighter = async (container) => {
  console.log("initialiseHighlighter");
  const model = await loadGraphModel();
  if ($(".backdrop").length === 0) {
    container.append(
      `<div class="backdrop"><div class="highlights Am Al"></div><div id="tempDomParser"></div>
      <svg class="loadingIcon hide" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: none; shape-rendering: auto;" width="20px" height="20px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <circle cx="50" cy="50" fill="none" stroke="#1d3f72" stroke-width="1" r="40" stroke-dasharray="188.49555921538757 64.83185307179586">
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="0.8474576271186441s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
      </circle>
      </svg></div>`
    );
  }

  const textAreaSelector = ".AD .iN .Am.Al";
  const $textarea = $(textAreaSelector);
  // const $backdrop = $(".backdrop");
  const $highlights = $(".highlights");
  // const $tempDomParser = $("#tempDomParser");
  // const $loading = $(".loadingIcon");
  const isExtentionEnabled = Cookies.get("gdpr-highlighter-enabled");
  console.log("isExtentionEnabled", isExtentionEnabled);

  const getPrediction = (text) => {
    console.log("Start Prediction", new Date(), new Date().getMilliseconds());
    return predict({ model, text });
  };

  const applyHighlights = async (text) => {
    const textArray = text.split(" ");
    var prediction = await getPrediction(text);
    let parsedText = "";

    console.log("Prediction:", prediction);
    prediction.map((element, index) => {
      const { entity, word } = element;
      const originalWord = textArray[index];

      if (word === originalWord?.toLowerCase()) {
        parsedText +=
          entity !== "O"
            ? `<mark data-entity="${entity}">${originalWord}</mark> `
            : `${originalWord} `;
      }
      return element;
    });

    const parsedTextRegex = parsedText
      .replace(postcodeRegex, '<mark data-entity="I-location">$&</mark>')
      .replace(creditCardRegex, '<mark data-entity="I-sensitive">$&</mark>')
      .replace(phoneNumberRegex, '<mark data-entity="I-sensitive">$&</mark>');

    return parsedTextRegex;
  };

  async function getNestedText(element) {
    $(element)
      .contents()
      .each(function () {
        if (this.nodeType === Node.TEXT_NODE && $(this).text().length > 1) {
          $(this).wrap('<span data-gdpr="true"></span>');
        } else {
          getNestedText($(this));
        }
      });
  }

  const handleInput = async () => {
    $highlights.html($textarea.html());
    console.log(
      ">>>>>>> HandleInput",
      new Date(),
      new Date().getMilliseconds()
    );

    await getNestedText($highlights);
    console.log("getNestedText DONE");

    // Get all element with GDPR attribute and apply highilight
    $(".highlights [data-gdpr]").each(function () {
      const text = $(this).text();
      applyHighlights(text).then((textEdited) => $(this).html(textEdited));
    });
  };

  const bindEvents = () => {
    $textarea.on({
      input: debounce(handleInput, 1500),
    });
  };

  handleInput();
  bindEvents();
};

export default initialiseHighlighter;
