import { plotPolyon } from "../libs/canvasUtils";
import { getPointOnRadius, IVec, sleep } from "../libs/utils";

const canvas = document.createElement("canvas");
canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.95;
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

const centre = { x: canvas.width / 2, y: canvas.height / 2 } as IVec;
const d = Math.min(canvas.width, canvas.height);
const points: IVec[] = [];
for (let i = 0; i < 20; i++) {
  const α = Math.random() * 2 * Math.PI;
  const l = Math.sign(Math.random() - 0.5) * (Math.floor(Math.random() * d * 0.35) + d * 0.1);
  points.push({ x: Math.round(centre.x + l * Math.cos(α)), y: Math.round(centre.y + l * Math.sin(α)) });
}

(async function () {
  // Polygon
  ctx.beginPath();
  ctx.strokeStyle = "#222222";
  plotPolyon(ctx, centre, ...points);
  ctx.stroke();
  const polygon = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let α = 0;
  while (true) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(polygon, 0, 0);
    const p = getPointOnRadius(centre, points, α);
    ctx.beginPath();
    ctx.fillStyle = "#FF0000";
    ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
    ctx.fill();
    α = (α + 0.01) % (2 * Math.PI);
    await sleep(10);
  }
})();