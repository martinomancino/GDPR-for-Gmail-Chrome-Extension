/* eslint-disable no-undef */
import $ from "jquery";
import initialiseHighlighter from "./highlighter";
import "./main.css";

console.log("Gmail script loading");
const containerSelector = ".Ar.Au";
const textAreaSelector = ".AD .iN .Am.Al";
// const textAreaSelector = ".Am.Al";
const container = $(containerSelector);
const textarea = $(textAreaSelector);
let initialised = false;

console.log("gmail running");

if (container && textarea && !initialised) {
  initialiseHighlighter(container);
  initialised = true;
}
