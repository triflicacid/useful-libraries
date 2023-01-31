import { plotPolyon } from "../libs/canvasUtils";
import { getPointOnRadius, IVec } from "../libs/utils";

/** Generate a random polygon */
function generatePolygon(n: number) {
  const points: IVec[] = [];
  for (let i = 0; i < n; i++) {
    const α = Math.random() * 2 * Math.PI;
    const l = Math.sign(Math.random() - 0.5) * (Math.floor(Math.random() * d * 0.35) + d * 0.1);
    points.push({ x: Math.round(centre.x + l * Math.cos(α)), y: Math.round(centre.y + l * Math.sin(α)) });
  }
  return points;
}

/** Draw polygon points to canvas, return cache */
function drawPolygon(points: IVec[]) {
  ctx.beginPath();
  ctx.strokeStyle = "#222222";
  plotPolyon(ctx, centre, ...points);
  ctx.stroke();
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

const canvas = document.createElement("canvas");
canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.95;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
document.body.appendChild(canvas);

const centre = { x: canvas.width / 2, y: canvas.height / 2 } as IVec;
const d = Math.min(canvas.width, canvas.height);
let points = generatePolygon(20);
let α = 0, dα = 0.01;
let polygon = drawPolygon(points);
let debug = true;

(async function () {
  requestAnimationFrame(function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(polygon, 0, 0);
    const p = getPointOnRadius(centre, points, α);
    if (debug) {
      ctx.strokeStyle = "#0000F0";
      ctx.beginPath();
      ctx.moveTo(centre.x, centre.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.strokeStyle = "#009900";
      ctx.beginPath();
      ctx.arc(centre.x, centre.y, 15, 0, -α, true);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.fillStyle = "#FF0000";
    ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
    ctx.fill();
    α = (α + dα) % (2 * Math.PI);
    requestAnimationFrame(loop);
  });

  document.body.insertAdjacentHTML("beforeend", "<br>");
  const div = document.createElement("div");
  div.insertAdjacentHTML("beforeend", "Points: ");
  const inputN = document.createElement("input");
  inputN.type = "number";
  inputN.min = "1";
  inputN.value = points.length.toString();
  inputN.addEventListener("change", () => btn.click());
  div.appendChild(inputN);
  div.insertAdjacentHTML("beforeend", " | dα/dt: ");
  const inputDα = document.createElement("input");
  inputDα.type = "number";
  inputDα.value = dα.toString();
  inputDα.addEventListener("change", () => dα = +inputDα.value);
  div.appendChild(inputDα);
  div.insertAdjacentHTML("beforeend", " | ");
  const inputDebug = document.createElement("input");
  inputDebug.type = "checkbox";
  inputDebug.checked = debug;
  inputDebug.addEventListener("change", () => debug = !debug);
  div.appendChild(inputDebug);
  div.insertAdjacentHTML("beforeend", " Debug | ");
  const btn = document.createElement("button");
  btn.innerText = "New Polygon";
  btn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let n = +inputN.value;
    points = generatePolygon(n);
    polygon = drawPolygon(points);
  });
  div.appendChild(btn);
  document.body.appendChild(div);
})();