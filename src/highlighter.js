/* eslint-disable no-undef */
import $ from "jquery";
import debounce from "debounce";
import { predict, loadGraphModel } from "./model";
import {
  phoneNumberRegex,
  creditCardRegex,
  highlighterHtmlInjection,
  highlighterCssInjection,
} from "./constants";

let startedPrediction = false;
let startDate;
let endDate;

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
    if (!startedPrediction) {
      console.log("Start Prediction", new Date(), new Date().getMilliseconds());
      startDate = new Date();
      startedPrediction = true;
    }

    return predict({ model, text });
  };

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
    $("#highlights [data-gdpr]").each(async function () {
      const text = $(this).html();
      await applyHighlights(text).then((textEdited) => {
        console.log("textEdited", text, textEdited);
        return $(this).html(textEdited);
      });
    });
    startedPrediction = false;
    endDate = new Date();
    console.log("End Prediction", new Date(), new Date().getMilliseconds());
    console.log(
      "Predicion performed in:",
      endDate.getTime() - startDate.getTime()
    );
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
