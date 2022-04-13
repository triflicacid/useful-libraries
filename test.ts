// import { Complex } from "./libs/maths/Complex";
// import { erf } from "./libs/maths/error-function";
// import { cubic, depressed_cubic } from "./libs/maths/polynomial";

import * as col from "./libs/color";

// // console.log(cubic(new Complex(2), new Complex(-8), new Complex(1.5), new Complex(69)));
// console.log(erf(new Complex(1, -2)).toString());

let hsl: [number, number, number] = [130, 100, 50];
const colors = col.getTones(...hsl, 10);

for (const [h, s, l] of colors) {
  let rgb = col.hsl2rgb(h, s, l);

  const p = document.createElement("p");
  const div = document.createElement("div");
  div.style.height = div.style.width = "30px";
  div.style.display = "inline-block";
  div.style.border = "1px solid black";
  div.style.backgroundColor = col.col2str("rgb", rgb);
  p.appendChild(div);
  p.insertAdjacentHTML("beforeend", ` &nbsp;<span>${col.rgb2hex(...rgb)}; ${col.col2str("hsl", [h, s, l])}</span>`);

  document.body.appendChild(p);
}