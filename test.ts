import { legendresEllipticIntegralFirst } from "./libs/maths/elliptic-integrals";

function main() {
  window.El = legendresEllipticIntegralFirst
}

window.addEventListener("load", main);