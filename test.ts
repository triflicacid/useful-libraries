import { poly_eval, poly_reccurence, poly_str } from "./libs/maths/polynomial";
import { perrin } from "./libs/maths/recurrence-relations";

function main() {
  const F = perrin();
  let x = 4;
  for (let i = 0; i <= 10; i++) {
    console.log(`F[${i}] = ${poly_str(F(i))}`);
    // console.log(`- F[${i}](${x}) = ${poly_eval(F(i), x)}`);
  }
}

window.addEventListener("load", main);