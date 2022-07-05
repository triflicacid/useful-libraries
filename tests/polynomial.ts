import { Complex } from "../libs/maths/Complex";
import { solveCubic, polynomial, pstr, solveQuartic } from "../libs/maths/polynomial";

function main() {
  const k = [1, -3, -12, 24];
  const ki = k.map(z => Complex.parse(z));
  const P = polynomial(ki);

  console.log(`f(z) = ` + pstr(ki));

  console.group("Working");
  // const roots = solveQuartic(ki[0], ki[1], ki[2], ki[3], ki[4]);
  const roots = solveCubic(ki[0], ki[1], ki[2], ki[3]);
  console.groupEnd();

  console.log(`f(z) = 0 has ${roots.length} roots`);
  roots.forEach(z => {
    console.log(`- root ${z}\n   f(z) = ` + P(z).toString());
  });
}

window.addEventListener("load", main); 