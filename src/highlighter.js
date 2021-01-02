/* eslint-disable no-undef */
import $ from "jquery";
import debounce from "debounce";
import { predict, loadGraphModel } from "./model";
import {
  postcodeRegex,
  phoneNumberRegex,
  creditCardRegex,
  highlighterHtmlInjection,
  highlighterCssInjection,
} from "./constants";

const initialiseHighlighter = async (container) => {
  const model = await loadGraphModel();

  if (!$("#cssInjection").length) $(highlighterCssInjection).appendTo("head");
  if ($("#backdrop").length === 0) {
    container.append(highlighterHtmlInjection);
  }

  const textAreaSelector = ".AD .iN .Am.Al";
  const $textarea = $(textAreaSelector);
  const $highlights = $("#highlights");

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
      .replace(postcodeRegex, '<mark data-entity="I-LOC">$&</mark>')
      .replace(creditCardRegex, '<mark data-entity="B-PII">$&</mark>')
      .replace(phoneNumberRegex, '<mark data-entity="B-PII">$&</mark>');

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
    await getNestedText($highlights);

    // Get all element with GDPR attribute and apply highilight
    $("#highlights [data-gdpr]").each(function () {
      const text = $(this).text();
      applyHighlights(text).then((textEdited) => $(this).html(textEdited));
    });
  };

  function bindEvents() {
    if (window.unbindTexareaEvent) {
      // Remove previous EventListener
      window.unbindTexareaEvent();
    }

    // Add new EventListener
    $textarea.on({
      input: debounce(handleInput, 1500),
    });

    window.unbindTexareaEvent = () =>
      $textarea.off({
        input: debounce(handleInput, 1500),
      });
  }

  handleInput();
  bindEvents();
};

export default initialiseHighlighter;
