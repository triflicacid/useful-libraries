import { fresnelAuxiliaryCosIntegral, fresnelAuxiliarySinIntegral, fresnelCosIntegral, fresnelSinIntegral } from "./libs/maths/fresnel-sin-cos-integrals";

function main() {
  window.S = fresnelSinIntegral
  window.Sin = fresnelAuxiliarySinIntegral
  window.C = fresnelCosIntegral
  window.Cin = fresnelAuxiliaryCosIntegral
}

window.addEventListener("load", main);