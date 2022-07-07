import { createExpression } from "../libs/expression-create";

function nested_funcs() {
  const { expr, parse } = createExpression();
  expr.setSymbol("f", (x: number) => {
    console.log("CALL f");
    return x + 3;
  });
  expr.setSymbol("g", (x: number) => {
    console.log("CALL g");
    return x ** 2;
  });
  parse("g(f(x))");
  expr.setSymbol("x", 2);
  console.log(tostr(expr.evaluate()));
}

function main() {
  const { expr, parse } = createExpression();
  expr.setSymbol("x", 2);
  expr.constSymbols.set("pi", Math.PI);
  parse("pi = 3");
  console.log(tostr(expr.evaluate()));
}

function tostr(o) {
  console.log(o)
  return o.error ? "[ERROR] " + o.msg : o.value.toString();
}

window.addEventListener("load", main); 