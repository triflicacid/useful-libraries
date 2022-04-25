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

const MIN = 5, MAX = 10;
let data = Array.from({ length: 200 }, () => Math.floor(Math.random() * (MAX - MIN)) + MIN);
let sum = data.reduce((a, b) => a + b);
div.insertAdjacentHTML("beforeend", `<p>Original: <code>${data.join(", ")}</code> | Sum = ${sum} | Min = ${Math.min(...data)} | Max = ${Math.max(...data)}</p>`);

data = normalise(...data);
div.insertAdjacentHTML("beforeend", `<p>Normalised: <code>${data.join(", ")}</code> | Sum = ${data.reduce((a, b) => a + b)} | Min = ${Math.min(...data)} | Max = ${Math.max(...data)}</p>`);

data = denormalise(sum, ...data);
div.insertAdjacentHTML("beforeend", `<p>De-Normalised: <code>${data.join(", ")}</code> | Sum = ${data.reduce((a, b) => a + b)} | Min = ${Math.min(...data)} | Max = ${Math.max(...data)}</p>`);