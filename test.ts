import { dirichletEta, riemannZeta } from "./libs/maths/riemann-zeta";

function main() {
  window.zeta = riemannZeta;
  window.eta = dirichletEta
}

window.addEventListener("load", main); 