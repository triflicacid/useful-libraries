// import { Complex } from "./libs/maths/Complex";
// import { erf } from "./libs/maths/error-function";
// import { cubic, depressed_cubic } from "./libs/maths/polynomial";

import * as col from "./libs/color";

// // console.log(cubic(new Complex(2), new Complex(-8), new Complex(1.5), new Complex(69)));
// console.log(erf(new Complex(1, -2)).toString());

for (let name in col.cssColors) {
  let p = document.createElement("p"), hex = col.cssColors[name], rgb = col.hex2rgb(hex);
  p.insertAdjacentHTML("beforeend", `${name}: `);
  let div = document.createElement("div");
  div.style.display = "inline-block";
  div.style.border = "1px solid black";
  div.style.padding = "4px";
  div.style.backgroundColor = hex;
  div.style.color = col.bestTextColor(rgb);
  div.insertAdjacentHTML("beforeend", `${hex}; ${col.col2str("rgb", col.hex2rgb(hex))}; ${col.col2str("hsl", col.rgb2hsl(...col.hex2rgb(hex)))}`);
  p.appendChild(div);
  document.body.appendChild(p);
}