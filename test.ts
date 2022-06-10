// import { Complex } from "./libs/maths/Complex";
// import { erf } from "./libs/maths/error-function";
// import { cubic, depressed_cubic } from "./libs/maths/polynomial";

import { parseArgstring } from "./libs/utils";

// // console.log(cubic(new Complex(2), new Complex(-8), new Complex(1.5), new Complex(69)));
// console.log(erf(new Complex(1, -2)).toString());

console.log(parseArgstring(""));
console.log(parseArgstring("-d"));
console.log(parseArgstring("--data \"Hello, world\""));