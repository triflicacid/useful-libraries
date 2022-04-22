// import { Complex } from "./libs/maths/Complex";
// import { erf } from "./libs/maths/error-function";
// import { cubic, depressed_cubic } from "./libs/maths/polynomial";

// // console.log(cubic(new Complex(2), new Complex(-8), new Complex(1.5), new Complex(69)));
// console.log(erf(new Complex(1, -2)).toString());

import * as col from "./libs/color";

const div = document.createElement("div");
document.body.appendChild(div);

let arr = [255, 0, 128] as [number, number, number];
div.insertAdjacentHTML("beforeend", `<p>${col.col2str("rgb", arr, Infinity)}</p>`);
arr = col.rgb2xyz(...arr);
div.insertAdjacentHTML("beforeend", `<p>${col.col2str("xyz", arr, Infinity)}</p>`);
arr = col.xyz2hlab(...arr);
div.insertAdjacentHTML("beforeend", `<p>${col.col2str("hunter-lab", arr, Infinity)}</p>`);
arr = col.hlab2xyz(...arr);
div.insertAdjacentHTML("beforeend", `<p>${col.col2str("xyz", arr, Infinity)}</p>`);