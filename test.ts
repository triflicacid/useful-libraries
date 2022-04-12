// import { Complex } from "./libs/maths/Complex";
// import { erf } from "./libs/maths/error-function";
// import { cubic, depressed_cubic } from "./libs/maths/polynomial";

import * as col from "./libs/color";

// // console.log(cubic(new Complex(2), new Complex(-8), new Complex(1.5), new Complex(69)));
// console.log(erf(new Complex(1, -2)).toString());

const canvas = document.createElement("canvas");
canvas.width = 700;
canvas.height = 400;
document.body.appendChild(canvas);
const s = new col.Spectrum("hsl", [-Infinity, 100, 50], [0, 360], col.hsl2rgb);
s.drawToCanvas(canvas.getContext("2d"), 0, 0, canvas.width, canvas.height);


let hsl: [number, number, number] = [360, 100, 50];
const colors = col.getTriadic(...hsl);

for (const [h, s, l] of colors) {
  let rgb = col.hsl2rgb(h, s, l);

  const p = document.createElement("p");
  const div = document.createElement("div");
  div.style.height = div.style.width = "30px";
  div.style.display = "inline-block";
  div.style.border = "1px solid black";
  div.style.backgroundColor = col.col2str("rgb", rgb);
  p.appendChild(div);
  p.insertAdjacentHTML("beforeend", ` &nbsp;<span>${col.rgb2hex(...rgb)}</span>`);

  document.body.appendChild(p);
}