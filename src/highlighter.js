/* eslint-disable no-undef */
import $ from "jquery";
import debounce from "debounce";
import { predict, loadGraphModel } from "./model";
import {
  phoneNumberRegex,
  creditCardRegex,
  ibanRegex,
  postcodeRegex,
  highlighterHtmlInjection,
  highlighterCssInjection,
} from "./constants";

/**
 * initialiseHighlighter
 *
 * @param {HTMLElement} container     Wrapper container of the email body
 * @param {String} textAreaSelector   Email textarea selector
 */
const initialiseHighlighter = async (container) => {
  const model = await loadGraphModel();

  if (!$("#cssInjection").length) $(highlighterCssInjection).appendTo("head");
  if ($("#backdrop").length === 0) {
    container.append(highlighterHtmlInjection);
  }

  const textAreaSelector = ".iN .Am.Al";
  const $textarea = $(textAreaSelector);
  const $highlights = $("#highlights");

  const getPrediction = (text) => {
    return predict({ model, text });
  };

  /**
   * applyHighlights
   *
   * @param {String} text Text to run the prediction on
   */
  const applyHighlights = async (text) => {
    const textArray = text.split(" ");
    var prediction = await getPrediction(text);
    let parsedText = "";

    prediction.map((element, index) => {
      const { entity, word } = element;
      const originalWord = textArray[index];

      if (word === originalWord?.toLowerCase()) {
        // Strip double space
        const parsedWord = originalWord.includes("&nbsp;")
          ? originalWord
          : `${originalWord} `;

        parsedText +=
          entity !== "O"
            ? `<mark data-entity="${entity}">${parsedWord}</mark> `
            : `${parsedWord}`;
      }
      return element;
    });

    const parsedTextRegex = parsedText
      .replace(creditCardRegex, '<mark data-entity="B-PII">$&</mark>')
      .replace(ibanRegex, '<mark data-entity="B-PII">$&</mark>')
      .replace(phoneNumberRegex, '<mark data-entity="B-PII">$&</mark>')
      .replace(postcodeRegex, '<mark data-entity="B-LOC">$&</mark>');

    return parsedTextRegex;
  };

  /**
   * wrapTextToEvaluate
   *
   * @param {HTMLElement} element Copy of the textarea element
   */
  async function wrapTextToEvaluate(element) {
    $(element)
      .contents()
      .each(function () {
        if (this.nodeType === Node.TEXT_NODE && $(this).text().length > 1) {
          $(this).wrap('<span data-gdpr="true"></span>');
        } else {
          wrapTextToEvaluate($(this));
        }
      });
  }

  const handleInput = async () => {
    $highlights.html($textarea.html());
    await wrapTextToEvaluate($highlights);

    // Get all element with GDPR attribute and apply highilight
    $("#highlights [data-gdpr]").each(async function () {
      const text = $(this).html();
      await applyHighlights(text).then((textEdited) => {
        return $(this).html(textEdited);
      });
    });
    $("#highlights").removeClass("hide");
    $("#extensionWatchingIconAbsolute").removeClass("loading");
  };

  const hideHighlights = () => {
    $("#extensionWatchingIconAbsolute").addClass("loading");
    $("#highlights").addClass("hide");
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

    $textarea.on({
      input: hideHighlights,
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
