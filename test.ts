// import { Complex } from "./libs/maths/Complex";
// import { erf } from "./libs/maths/error-function";
// import { cubic, depressed_cubic } from "./libs/maths/polynomial";

// // console.log(cubic(new Complex(2), new Complex(-8), new Complex(1.5), new Complex(69)));
// console.log(erf(new Complex(1, -2)).toString());

import * as col from "./libs/color";
import { denormalise, normalise } from "./libs/utils";

window.col = col;

let div = document.createElement("div");
document.body.appendChild(div);

let arr = [0, 0, 128];
div.insertAdjacentHTML("beforeend", `<p>${col.col2str("rgb", arr, Infinity)}</p>`);
arr = col.rgb2cmy(...arr);
div.insertAdjacentHTML("beforeend", `<p>${col.col2str("cmy", arr, Infinity)}</p>`);
arr = col.cmy2cmyk(...arr);
div.insertAdjacentHTML("beforeend", `<p>${col.col2str("cmyk", arr, Infinity)}</p>`);
div.insertAdjacentHTML("beforeend", `<p>${col.col2str("rgb", col.cmyk2rgb(...arr), Infinity)}</p>`);
div.insertAdjacentHTML("beforeend", `<p>${col.col2str("cmy", col.cmyk2cmy(...arr), Infinity)}</p>`); 