import * as sc from "./libs/maths/sin-cos-integrals";

function main() {
  window.si = sc.sinIntegral
  window.ci = sc.cosIntegral
  window.cin = sc.entireCosineIntegral
  window.fi = sc.auxiliarySinIntegral
  window.gi = sc.auxiliaryCosIntegral
}

window.addEventListener("load", main);