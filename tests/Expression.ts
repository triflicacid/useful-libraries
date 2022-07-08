import { errorToString, Expression } from "../libs/Expression";
import { createExpression } from "../libs/expression-create";

function main() {
  const E = createExpression();
  E.setSymbol("f", {
    type: 'fn',
    args: ['x'],
    body: 'x * g(x)',
  });
  E.setSymbol("g", {
    type: 'fn',
    args: ['x'],
    body: 'x + 1',
  });

  let val = E.load("f(5)").parse().evaluate();
  console.log(E.source);
  if (E.error) {
    console.log(E.handleError());
  } else {
    console.log(val === undefined ? "nil" : val.toString());
  }
}

window.addEventListener("load", main); 