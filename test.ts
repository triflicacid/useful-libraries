import { createComplexExpression, createExpression } from "./libs/expression-create";

function main() {
  // const { expr, parse } = createComplexExpression();
  // parse("ln(i) + 1");
  // console.log(tostr(expr.evaluate()));
  const { expr, parse } = createExpression();
  parse("sqrt(2) + 2 ** 3 - 1");
  console.log(tostr(expr.evaluate()));
}

function tostr(o) {
  console.log(o)
  return o.error ? "[ERROR] " + o.msg : o.value.toString();
}

window.addEventListener("load", main); 