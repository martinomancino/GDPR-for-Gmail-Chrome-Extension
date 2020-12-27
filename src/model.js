import { BertTokenizer } from "./tokenizer";
import * as tf from "@tensorflow/tfjs";
import { tagsMap, tokenBlacklist } from "./constants";
import { sortBy } from "lodash";

const bertTokenizer = new BertTokenizer(true);

export async function loadGraphModel() {
  const modelUrl = chrome.runtime.getURL("model/model.json");
  const graphModel = await tf.loadGraphModel(modelUrl);

  return graphModel;
}

export async function predict({ model, text }) {
  // console.log(" Predict text", text);
  const { inputIds, inputMask } = bertTokenizer.convertSingleExample(text);
  // Run model inference
  const result = tf.tidy(() => {
    const inputTensor = tf.tensor([inputIds], undefined, "int32");
    const maskTensor = tf.tensor([inputMask], undefined, "int32");

    // Run model inference
    return model.predict({
      input_ids: inputTensor,
      attention_mask: maskTensor,
    });
  });

  const results = await parsePredictionResults(result, inputIds);
  console.log("End Prediction", new Date(), new Date().getMilliseconds());
  return results;
}

const reconcileWord = (tokens, index) => {
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

const parsePredictionResults = async (results, inputIds) => {
  const resultsIndexed = await tf.softmax(results).squeeze().array();
  const tokens = bertTokenizer.convertIdsToTokens(inputIds);

  console.log("Tokens", tokens);

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
