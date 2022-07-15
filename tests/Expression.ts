import { Expression } from "../libs/Expression";
import { createExpression } from "../libs/expression-create";

function main() {
  const E = new Expression();
  E.setSymbol("f", {
    type: 'fn',
    args: ['x'],
    body: '2 * x',
  });
  E.setSymbol("g", {
    type: 'fn',
    args: ['x'],
    body: 'x + 1',
  });
  E.setSymbol("pow", {
    type: 'fn',
    args: ['x', 'y'],
    body: 'x ** y',
  });

  E.setSymbol("x", 4);
  // let val = E.load("f(f(g(x)) + g(f(x)))").parse().evaluate();
  // 2*(2*(x+1) + (2*x)+1) = 2*(4*x+3) = 8*x+6
  let val = E.load("pow(f(x), g(x))").parse().evaluate();
  // (2*x) ** (x+1)
  if (E.error) {
    console.log(E.handleError());
  } else {
    console.log(val === undefined ? "nil" : val.toString());
  }
}

window.addEventListener("load", main); 