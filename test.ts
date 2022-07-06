import { poly_differentiate, poly_eval, poly_integrate, poly_parse, poly_reccurence, poly_str } from "./libs/maths/polynomial";

function main() {
  const T = poly_reccurence([{ 1: 2 }, { 0: -1 }], [{ 0: 1 }, { 1: 1 }]); // Chebyschev T[n] reccurence formula
  let x = 4;
  for (let i = 0; i <= 5; i++) {
    console.log(`T[${i}] = ${poly_str(T(i))}`);
    console.log(`- T[${i}](${x}) = ${poly_eval(T(i), x)}`);
  }
  // let a = poly_parse("x^2 + 3");
  // let da = poly_differentiate(a);
  // console.log(`(${poly_str(a)})' = (${poly_str(da)})`);
  // a = poly_integrate(da);
  // console.log(`(${poly_str(da)})' = (${poly_str(a)})`);
}

window.addEventListener("load", main);