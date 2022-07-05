import { catalanBeta } from "./libs/maths/catalan-beta";

function main() {
  window.beta = catalanBeta;
}

window.addEventListener("load", main);