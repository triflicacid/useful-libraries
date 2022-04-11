// import { Complex } from "./libs/maths/Complex";
// import { erf } from "./libs/maths/error-function";
// import { cubic, depressed_cubic } from "./libs/maths/polynomial";

import * as col from "./libs/color";

// // console.log(cubic(new Complex(2), new Complex(-8), new Complex(1.5), new Complex(69)));
// console.log(erf(new Complex(1, -2)).toString());

let x = [255, 5, 127];
console.log(col.col2str("rgb", x));
x = col.rgb2cmyk(...x);
console.log(col.col2str("cmyk", x));
x = col.cmyk2rgb(...x);
console.log(col.col2str("rgb", x));