const tagsMap = [
  "B-DIS",
  "B-LOC",
  "B-MISC",
  "B-ORG",
  "B-PER",
  "E-DIS",
  "I-DIS",
  "I-LOC",
  "I-MISC",
  "I-ORG",
  "I-PER",
  "O",
  "O-DOCSTART-",
  "S-DIS",
];

const ibanRegex = /\b[A-Z]{2}[0-9]{2}(?:[ ]?[0-9, A-Z]{4}){3,7}(?!(?:[ ]?[0-9]){3})(?:[ ]?[0-9]{1,2})?\b/g;
const creditCardRegex = /\b(?:[ |-]?[0-9]{3,4}){4}\b/g;
const phoneNumberRegex = /\b((\(?0\d{4}\)?\s?\d{3}\s?\d{3})|(\(?0\d{3}\)?\s?\d{3}\s?\d{4})|(\(?0\d{2}\)?\s?\d{4}\s?\d{4}))(\s?\(\d{4}|\d{3})?|((\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3})|((((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\(\d{4}|\d{3}))\b/g;
const postcodeRegex = /(?:[A-Za-z]\d ?\d[A-Za-z]{2})|(?:[A-Za-z][A-Za-z\d]\d ?\d[A-Za-z]{2})|(?:[A-Za-z]{2}\d{2} ?\d[A-Za-z]{2})|(?:[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]{2})|(?:[A-Za-z]{2}\d[A-Za-z] ?\d[A-Za-z]{2})$/g;

const tokenBlacklist = ["[SEP]", "[CLS]", "[PAD]"];

const gmailContainerSelector = ".Ar.Au";
const gmailTextAreaSelector = ".iN .Am.Al";

const highlighterHtmlInjection = `<div id="backdrop">
<div id="highlights" class="Am Al"></div>
<svg id="extensionWatchingIconAbsolute" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 248 248" style="enable-background:new 0 0 248 248;" xml:space="preserve">
<style type="text/css">
.st0{fill-rule:evenodd;clip-rule:evenodd;fill:#003FA8;}
.st1{fill:#3C78DB;}
.st2{fill:#36A852;}
.st3{fill:#F9BC15;}
.st4{fill:#EA4535;}
.st5{fill:#C52627;}
</style>
<desc>Created with Sketch.</desc>
<g id="Page-1">
<g id="Logo">
  <path id="Combined-Shape" class="st0" d="M124,215.1l3.9,11l11.6,0.2l-9.2,7l3.2,11.1l-9.5-6.6l-9.5,6.6l3.2-11.1l-9.2-7l11.6-0.2
    L124,215.1z M71.5,200.1l3.9,11l11.6,0.2l-9.2,7l3.2,11.1l-9.5-6.6l-9.5,6.6l3.2-11.1l-9.2-7l11.6-0.2L71.5,200.1z M176.5,200.1
    l3.9,11l11.6,0.2l-9.2,7l3.2,11.1l-9.5-6.6l-9.5,6.6l3.2-11.1l-9.2-7l11.6-0.2L176.5,200.1z M215.2,162.7l3.9,11l11.6,0.2l-9.2,7
    l3.2,11.1l-9.5-6.6l-9.5,6.6l3.2-11.1l-9.2-7l11.6-0.2L215.2,162.7z M32.8,162.7l3.9,11l11.6,0.2l-9.2,7l3.2,11.1l-9.5-6.6
    l-9.5,6.6l3.2-11.1l-9.2-7l11.6-0.2L32.8,162.7z M19.1,110.2l3.9,11l11.6,0.2l-9.2,7l3.2,11.1l-9.5-6.6l-9.5,6.6l3.2-11.1l-9.2-7
    l11.6-0.2L19.1,110.2z M228.9,110.2l3.9,11l11.6,0.2l-9.2,7l3.2,11.1l-9.5-6.6l-9.5,6.6l3.2-11.1l-9.2-7l11.6-0.2L228.9,110.2z
    M215.2,57.7l3.9,11l11.6,0.2l-9.2,7l3.2,11.1l-9.5-6.6l-9.5,6.6l3.3-11l-9.2-7l11.6-0.2L215.2,57.7z M32.8,57.7l3.9,11L48.3,69
    L39,76l3.2,11.1l-9.5-6.5l-9.5,6.6l3.2-11.1L17.3,69l11.6-0.2L32.8,57.7z M71.5,19l3.9,11L87,30.2l-9.2,7L81,48.4l-9.5-6.5
    L62,48.5l3.2-11.1L56,30.2L67.7,30L71.5,19z M176.5,19l3.9,11l11.6,0.2l-9.2,7l3.2,11.1l-9.5-6.6l-9.5,6.6l3.2-11.1l-9.2-7
    l11.6-0.2L176.5,19z M124,4l3.9,11l11.6,0.2l-9.2,7l3.2,11.1l-9.5-6.6l-9.5,6.6l3.2-11.1l-9.2-7l11.6-0.2L124,4z"/>
</g>
</g>
<g>
<g>
  <path class="st1" d="M76.9,165.9H95V122l-25.8-19.3v55.6C69.2,162.5,72.7,165.9,76.9,165.9z"/>
  <path class="st2" d="M157,165.9h18.1c4.3,0,7.7-3.5,7.7-7.7v-55.6L157,122L157,165.9L157,165.9z"/>
  <path class="st3" d="M157,88.4V122l25.8-19.3V92.3c0-9.6-10.9-15-18.6-9.3L157,88.4z"/>
  <path class="st4" d="M95,122V88.5l31,23.3l31-23.3V122l-31,23.2L95,122z"/>
  <path class="st5" d="M69.2,92.3v10.3L95,122V88.4L87.8,83C80.1,77.3,69.2,82.8,69.2,92.3z"/>
</g>
</g>
</svg>
</div>`;

const highlighterCssInjection = `<style id="cssInjection">#backdrop {
  min-width: 100%;
  min-height: 100%;
  position: absolute;
  top: 10px;
  left: 0;
  z-index: 1;
  background-color: #fff;
  overflow: auto;
  pointer-events: none;
  transition: transform 1s;
}

.HM .Ar {
  position: relative;
}

.HM .Ar #backdrop {
  top: 0px;
}

#highlights,
#highlights *,
#highlights font {
  color: transparent !important;
}

#highlights img, #highlights.hide {
  opacity: 0;
}

.Am.Al {
  position: relative;
  z-index: 2;
  background-color: transparent;
  overflow: auto;
  resize: none;
}

mark {
  border-radius: 2px;
  color: transparent;
  border-bottom: 2px solid;
  border-color: transparent;
  background: transparent;
  transition: border-width 0.6s linear;
  animation: fading 1s ease-in-out;
}

@keyframes fading {
  70% {
    background-color: transparent;
    border-bottom: 0px;
  }
}

mark[data-entity="B-PER"],
mark[data-entity="I-PER"],
mark[data-entity="B-LOC"],
mark[data-entity="I-LOC"],
mark[data-entity="B-ORG"],
mark[data-entity="I-ORG"],
mark[data-entity="B-PII"],
mark[data-entity="I-PII"] {
  border-color: rgb(62, 142, 247);
  background-color: rgba(62, 142, 247, 0.3);
}

mark[data-entity="B-DIS"],
mark[data-entity="I-DIS"],
mark[data-entity="E-DIS"],
mark[data-entity="S-DIS"] {
  border-color: rgb(255, 6, 6);
  background-color: rgba(240, 74, 74, 0.3);
}

mark[data-entity="O-DOCSTART-"], 
mark[data-entity="B-MISC"],
mark[data-entity="I-MISC"] {
  border-color: transparent;
  background-color: transparent;
}

#extensionWatchingIconAbsolute {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 30px;
  height: 30px;
}

#extensionWatchingIconAbsolute.loading {
  animation: loadingAnimation 1s infinite;
}

@keyframes loadingAnimation {
  0%   { opacity:1; }
  50%  { opacity:0; }
  100% { opacity:1; }
}

</style>`;

export {
  ibanRegex,
  phoneNumberRegex,
  creditCardRegex,
  postcodeRegex,
  tokenBlacklist,
  tagsMap,
  highlighterHtmlInjection,
  highlighterCssInjection,
  gmailContainerSelector,
  gmailTextAreaSelector,
};
