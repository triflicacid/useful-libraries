import { createExpression } from "../libs/expression-create";

function main() {
  const { expr, parse } = createExpression();
  expr.setSymbol("f", (x) => {
    console.log("CALL f");
    return x + 3;
  });
  expr.setSymbol("g", (x) => {
    console.log("CALL g");
    return x ** 2;
  });
  parse("g(f(x))");
  expr.setSymbol("x", 2);
  console.log(tostr(expr.evaluate()));
}

function tostr(o) {
  console.log(o)
  return o.error ? "[ERROR] " + o.msg : o.value.toString();
}

window.addEventListener("load", main); 