import { Expression } from "./libs/Expression";

function main() {
  let obj = new Expression();
  obj.load('2 ** 3 ** 4');
  obj.parse();
  console.log(obj.evaluate());
}

window.addEventListener("load", main);