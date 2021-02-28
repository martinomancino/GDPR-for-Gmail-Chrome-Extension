import * as tf from "@tensorflow/tfjs";
import { BertTokenizer } from "./tokenizer";
import { tagsMap, tokenBlacklist } from "./constants";
import { sortBy } from "lodash";

export const bertTokenizer = new BertTokenizer(true);

/**
 * loadGraphModel
 *
 * Loads the ML graph model in the memory
 */
export async function loadGraphModel() {
  const modelUrl = chrome.runtime.getURL("model/model.json");
  const graphModel = await tf.loadGraphModel(modelUrl);

  return graphModel;
}

/**
 *
 * @param {Object} model Graph ML model
 * @param {String} text Text to run the prediction on
 */
export function predict({ model, text }) {
  const { inputIds, inputMask } = bertTokenizer.convertSingleExample(text);

  const result = tf.tidy(() => {
    const inputTensor = tf.tensor([inputIds], undefined, "int32");
    const maskTensor = tf.tensor([inputMask], undefined, "int32");

    // Run model inference
    return model.predict({
      input_ids: inputTensor,
      attention_mask: maskTensor,
    });
  });

  return parsePredictionResults(result, inputIds);
}

/**
 * reconcileWord
 *
 * @param {Array} tokens
 * @param {Int} index
 */
export const reconcileWord = (tokens, index) => {
  let word = tokens[index];

  if (!word) return word;

  if (
    tokens[index + 1] &&
    !tokens[index + 1].startsWith("▁") &&
    !tokens[index + 1].startsWith("[")
  ) {
    return (word += reconcileWord(tokens, index + 1));
  }

  if (tokens[index + 1] && tokens[index + 1].startsWith("▁.")) {
    tokens[index + 1] = "";
    return (word += ".");
  }

  return word;
};

/**
 * parsePredictionResults
 *
 * @param {Array} results Model prediction in a multidimensional array
 * @param {*} inputIds
 */
export const parsePredictionResults = async (results, inputIds) => {
  const resultsIndexed = await tf.softmax(results).squeeze().array();
  const tokens = bertTokenizer.convertIdsToTokens(inputIds);

  const parsedResults = resultsIndexed.map((resultArray, resultsIndex) => {
    let word;

    if (!tokenBlacklist.includes(tokens[resultsIndex])) {
      word = reconcileWord(tokens, resultsIndex);
    }

    const unsorted = resultArray.map((prediction, predictionIndex) => {
      return {
        score: prediction,
        entity: tagsMap[predictionIndex],
        word,
      };
    });
    console.log("unsorted", unsorted);

    const sorted = sortBy(unsorted, "score");
    return sorted[sorted.length - 1];
  });

  return parsedResults
    .filter(
      (item) =>
        !!item.score &&
        item.word !== "" &&
        item.word &&
        item.word.startsWith("▁") &&
        !tokenBlacklist.includes(item.word)
    )
    .map((item) => ({ ...item, word: item.word.replace("▁", "") }));
};
