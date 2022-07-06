import { dawsonIntegral } from "./libs/maths/dawson-integral";

function main() {
  window.Daw = dawsonIntegral
}

window.addEventListener("load", main);