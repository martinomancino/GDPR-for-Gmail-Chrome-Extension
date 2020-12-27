const tagsMap = [
  "O",
  "B-location",
  "I-group",
  "B-corporation",
  "I-person",
  "B-product",
  "B-creative-work",
  "I-corporation",
  "I-product",
  "B-person",
  "I-creative-work",
  "I-location",
  "B-group",
];

// export const tagsMap = [
//   "B-location",
//   "B-miscellaneaus",
//   "B-corporation",
//   "B-person",
//   "I-location",
//   "I-miscellaneaus",
//   "I-corporation",
//   "I-person",
//   "O",
//   "O-Docstar",
// ];

// export const tagsMap = [
//   "B-corporation",
//   "I-corporation",
//   "B-group",
//   "I-group",
//   "O",
//   "B-person",
//   "I-person",
//   "B-location",
//   "I-creative-work",
//   "B-creative-work",
//   "B-product",
//   "I-location",
//   "I-product",
// ];

// ISSUE: phone numbers and postcode matches iban as well
const ibanRegex = /(?:IT|SM)\d{2}[A-Z]\d{22}|CY\d{2}[A-Z]\d{23}|NL\d{2}[A-Z]{4}\d{10}|LV\d{2}[A-Z]{4}\d{13}|(?:BG|BH|GB|IE)\d{2}[A-Z]{4}\d{14}|GI\d{2}[A-Z]{4}\d{15}|RO\d{2}[A-Z]{4}\d{16}|KW\d{2}[A-Z]{4}\d{22}|MT\d{2}[A-Z]{4}\d{23}|NO\d{13}|(?:DK|FI|GL|FO)\d{16}|MK\d{17}|(?:AT|EE|KZ|LU|XK)\d{18}|(?:BA|HR|LI|CH|CR)\d{19}|(?:GE|DE|LT|ME|RS)\d{20}|IL\d{21}|(?:AD|CZ|ES|MD|SA)\d{22}|PT\d{23}|(?:BE|IS)\d{24}|(?:FR|MR|MC)\d{25}|(?:AL|DO|LB|PL)\d{26}|(?:AZ|HU)\d{27}|(?:GR|MU)\d{28}$/g;

const creditCardRegex = /3(?:[47]\d([ -]?)\d{4}(?:\1\d{4}){2}|0[0-5]\d{11}|[68]\d{12})$|^4(?:\d\d\d)?([ -]?)\d{4}(?:\2\d{4}){2}$|^6011([ -]?)\d{4}(?:\3\d{4}){2}$|^5[1-5]\d\d([ -]?)\d{4}(?:\4\d{4}){2}$|^2014\d{11}$|^2149\d{11}$|^2131\d{11}$|^1800\d{11}$|^3\d{15}$/g;
const postcodeRegex = /(?:[A-Za-z]\d ?\d[A-Za-z]{2})|(?:[A-Za-z][A-Za-z\d]\d ?\d[A-Za-z]{2})|(?:[A-Za-z]{2}\d{2} ?\d[A-Za-z]{2})|(?:[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]{2})|(?:[A-Za-z]{2}\d[A-Za-z] ?\d[A-Za-z]{2})$/g;
const phoneNumberRegex = /(\s*\(?0\d{4}\)?\s*\d{6}\s*)|(\s*\(?0\d{3}\)?\s*\d{3}\s*\d{4}\s*)$/g;

const tokenBlacklist = ["[SEP]", "[CLS]", "[PAD]"];

export {
  ibanRegex,
  postcodeRegex,
  phoneNumberRegex,
  creditCardRegex,
  tokenBlacklist,
  tagsMap,
};
