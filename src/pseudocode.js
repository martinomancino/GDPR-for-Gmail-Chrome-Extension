
// Highlighter
function initialiseHighlighter(emailContainer) {
  Load ML model syncronously
  IF backdropElement is not in the DOM 
    Append backdropElement to the emailContainer
  END IF

  Get references to Gmail textArea UI element
  Initialise Event Listeners for the textArea 
}

function handleTextAreaChange() {
  Copy textArea content on the backdropElement 
  loop recoursively through backdropElement childs
    IF childs is text
      wrap it in an HTML tag with attribute "data-gdpr"
    END IF

  forEach element with "data-gdpr" attribute
    Get text inside the element
    Get prediction for the extracted text 
    Parse prediction data received from ML model
    Apply prediction to element content  
}


// ML Model
function predict(model, text) {
  Convert text to tokens with the Bert tokenizer
  Define input and attention mask shapes

  Get prediction for the text
  Parse prediction results for token conversion 
}

function parsePredictionResults(resultsIDs) {
  results = Convert back resultsIDs to tokenized words
  reconciledResults = Parse results rencociling tokenized words

  predictions = for result in reconciledResults
    Sort prediction scores
    Get the highest score
  end for

  parsedPrediction = Parse predictions stripping out concatenation tokens
  return parsedPrediction
}