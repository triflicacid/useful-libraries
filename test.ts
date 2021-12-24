import { drawArrow, roundedRect } from "./libs/canvasUtils";

function main() {
  var canvas = document.createElement('canvas');
  canvas.style.border = "1px solid black";
  canvas.width = 800;
  canvas.height = 600;
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  drawArrow(ctx, 10, 10, 60, 60, 4, 15);
}

window.addEventListener("load", main);