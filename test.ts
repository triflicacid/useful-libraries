// import { Complex } from "./libs/maths/Complex";
// import { erf } from "./libs/maths/error-function";
// import { cubic, depressed_cubic } from "./libs/maths/polynomial";

import { Tabs } from "./libs/Tabs";

// // console.log(cubic(new Complex(2), new Complex(-8), new Complex(1.5), new Complex(69)));
// console.log(erf(new Complex(1, -2)).toString());

const map = new Map();
map.set("One", { content: generateContent("One"), text: "One" })
map.set("Two", { content: generateContent("Two"), text: "Two" })
const tabs = new Tabs(document.body, map);

function generateContent(text: string) {
  let div = document.createElement("div");
  div.insertAdjacentHTML("beforeend", `<p>${text}</p>`);
  return div;
}