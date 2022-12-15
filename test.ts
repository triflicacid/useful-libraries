import { partitionCount } from "./libs/maths/partition"

function main() {
    console.log(partitionCount(4447))
}

// import { seperateComponents, tint } from "./libs/canvasUtils.js";

// function main() {
//     const container = document.createElement("div");
//     document.body.appendChild(container);
//     container.insertAdjacentHTML("beforeend", "<h1>Split Image Component</h1>");
//     const btn = document.createElement("button");
//     btn.innerText = "Upload Image";
//     container.appendChild(btn);
//     const upload = document.createElement("input");
//     upload.type = "file";
//     upload.accept = ".jpg,.jpeg,.png,.jfif";
//     btn.addEventListener("click", () => upload.click());
//     upload.addEventListener("change", async ev => {
//         const file = upload.files[0];
//         if (file) {
//             div.innerHTML = "<h2>Original</h2>";

//             const url = await new Promise(res => {
//                 const reader = new FileReader();
//                 reader.onload = e => res(e.target.result);
//                 reader.readAsDataURL(file);
//             });
//             const img = await new Promise(res => {
//                 const img = new Image();
//                 img.onload = () => res(img);
//                 img.src = url;
//             });

//             let canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
//             canvas.width = img.width;
//             canvas.height = img.height;
//             ctx.drawImage(img, 0, 0);
//             div.appendChild(canvas);

//             let parts = seperateComponents(canvas);
//             for (let oc of parts) {
//                 div.insertAdjacentHTML("beforeend", "<br>");
//                 let canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
//                 canvas.width = img.width;
//                 canvas.height = img.height;
//                 ctx.drawImage(oc, 0, 0);
//                 div.appendChild(canvas);
//             }

//             let oc = new OffscreenCanvas(img.width, img.height), occtx = oc.getContext("2d");
//             occtx.drawImage(img, 0, 0);
//             let tinted = tint(oc, 100, 150, 0);

//             canvas = document.createElement("canvas");
//             ctx = canvas.getContext("2d");
//             canvas.width = img.width;
//             canvas.height = img.height;
//             ctx.drawImage(tinted, 0, 0);
//             div.appendChild(canvas);
//         }
//     });
//     container.insertAdjacentHTML("beforeend", "<br>");

//     const div = document.createElement("div");
//     container.appendChild(div);
// }

window.addEventListener("load", main);