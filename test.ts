import { Complex } from "./libs/maths/Complex";

function main() {
  let z = new Complex(0, 8);
  console.log(`exp(${z}) = ${Complex.exp(z)}`);
}

window.addEventListener("load", main);