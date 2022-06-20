import { Expression, OPERATORS_IMAG } from "./libs/Expression";

function main() {
  let expr = new Expression('2i + 3');
  expr.numberOpts.imag = 'i';
  expr.parse(OPERATORS_IMAG);
  console.log(expr.evaluate());
}

window.addEventListener("load", main); 