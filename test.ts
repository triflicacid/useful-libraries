import { parseNumber } from "./libs/utils";

function main() {
  console.log(parseNumber("-18", { signed: false }));
}

window.addEventListener("load", main);