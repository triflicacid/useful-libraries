import { BitArray } from "./libs/BitArray";

function main() {
  const arr = new BitArray([1, 0, 1, 1]);
  window.arr = arr;
}

window.addEventListener("load", main);