// import { Complex } from "./libs/maths/Complex";
// import { erf } from "./libs/maths/error-function";
// import { cubic, depressed_cubic } from "./libs/maths/polynomial";

import * as col from "./libs/color";

// // console.log(cubic(new Complex(2), new Complex(-8), new Complex(1.5), new Complex(69)));
// console.log(erf(new Complex(1, -2)).toString());

const spectrum = new col.Spectrum("hsl", [-Infinity, 100, 50], [0, 360], col.hsl2rgb);

const d = spectrum.createInteractive(600, 400);
document.body.appendChild(d.element);
d.element.style.border = "1px solid black";
d.onclick = (e, x, y) => {
  let rgba = d.getRGBAColor(x), str = col.col2str("rgba", rgba);
  div.style.backgroundColor = str;
  span.innerText = col.rgba2hexa(...rgba);
}
const div = document.createElement("div");
div.style.width = div.style.height = "50px";
div.style.border = "1px solid black";
document.body.appendChild(div);
const span = document.createElement("span");
document.body.appendChild(span);