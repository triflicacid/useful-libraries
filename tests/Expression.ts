import { errorToString, Expression } from "../libs/Expression";
import { createExpression } from "../libs/expression-create";

function main() {
  const E = createExpression();
  E.setSymbol("f", (x: number, E: Expression) => {
    E.setError("HALT", 69);
    return x + 1;
  });
  E.setSymbol("g", (x: number) => x * x);
  E.setSymbol("x", 2);

  let val = E.load("f(x)").parse().evaluate();
  if (E.error) {
    console.log(errorToString(E.error));
  } else {
    console.log(val === undefined ? "nil" : val.toString());
  }
}

window.addEventListener("load", main); 