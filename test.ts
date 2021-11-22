import { Complex } from "./libs/Complex";

function main() {
  const a = new Complex(1, 2);
  const b = new Complex(5, -10);
  console.log(Complex.logab(a, b).toString());
}

window.addEventListener("load", main);