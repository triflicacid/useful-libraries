import { createExpression } from "../libs/expression-create";

function main() {
  const { expr, parse } = createExpression();
  expr.setSymbol("f", (x: number) => {
    console.log("CALL f with " + x);
    return x + 0;
  });
  expr.setSymbol("g", (x: number) => {
    console.log("CALL g with " + x);
    return x ** 2;
  });
  parse("f(g(x) + 1)");
  expr.setSymbol("x", 2);
  console.log(tostr(expr.evaluate()));
}

function tostr(o) {
  console.log(o)
  return o.error ? "[ERROR] " + o.msg : o.value.toString();
}

window.addEventListener("load", main); 