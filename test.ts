import { beta } from "./libs/maths/general";

function main() {
  let n = 5;
  let a = Array.from({ length: n + 3 }, (_, k) => beta(n, k));
  console.log(a);
}

window.addEventListener("load", main);