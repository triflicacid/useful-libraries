import { Complex } from "./libs/maths/Complex";
import { erfi } from "./libs/maths/error-function";

function main() {
  window.erfi = erfi
}

window.addEventListener("load", main);