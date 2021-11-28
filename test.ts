import { roundedRect } from "./libs/canvasUtils";

function main() {
  var canvas = document.createElement('canvas');
  canvas.style.border = "1px solid black";
  canvas.width = 800;
  canvas.height = 600;
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  roundedRect(ctx, 40, 40, 100, 100, 10, 20, 30, 40);
  ctx.strokeStyle = "purple";
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = 'violet';
  ctx.fill();
}

window.addEventListener("load", main);