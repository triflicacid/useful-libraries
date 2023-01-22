import { Matrix } from "../libs/maths/Matrix";
import { createCamera, drawPoints, line, Point3D, projectPoints } from "../libs/shapes";

type Point4D = [number, number, number, number];

function main() {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 800;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  const camera = createCamera(ctx, { fov: canvas.width });
  const points: Point4D[] = [
    [-1, -1, -1, 1],
    [+1, -1, -1, 1],
    [+1, +1, -1, 1],
    [-1, +1, -1, 1],
    [-1, -1, +1, 1],
    [+1, -1, +1, 1],
    [+1, +1, +1, 1],
    [-1, +1, +1, 1],
    [-1, -1, -1, -1],
    [+1, -1, -1, -1],
    [+1, +1, -1, -1],
    [-1, +1, -1, -1],
    [-1, -1, +1, -1],
    [+1, -1, +1, -1],
    [+1, +1, +1, -1],
    [-1, +1, +1, -1],
  ];

  // const dist
  const dist = 2;
  let angle = 0;
  const rotation = Matrix.rotate3DX(-Math.PI / 2);

  requestAnimationFrame(function loop() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const translated = points.map(point => {
      let mat = Matrix.fromVector(...point);
      mat = Matrix.mult(Matrix.rotateXY(4, angle), mat);
      mat = Matrix.mult(Matrix.rotateZW(4, angle), mat);
      // mat = Matrix.mult(Matrix.rotateXZ(4, angle), mat);
      const w = 1 / (dist - mat.matrix[3][0]);
      mat = Matrix.mult(Matrix.projectionOrthographic(4, w), mat);
      mat = mat.scalarMult(150);
      mat = Matrix.mult(rotation, mat);
      return mat.toVector() as Point3D;
    });
    const twod = projectPoints(translated, camera);
    ctx.fillStyle = ctx.strokeStyle = "white";
    drawPoints(ctx, twod, 4);
    for (let i = 0; i < 4; i++) {
      line(ctx, i, (i + 1) % 4, twod);
      line(ctx, i + 4, (i + 1) % 4 + 4, twod);
      line(ctx, i, i + 4, twod);
    }
    for (let i = 0; i < 4; i++) {
      line(ctx, 8 + i, 8 + (i + 1) % 4, twod);
      line(ctx, 8 + i + 4, 8 + (i + 1) % 4 + 4, twod);
      line(ctx, 8 + i, 8 + i + 4, twod);
    }
    for (let i = 0; i < 8; i++) {
      line(ctx, i, i + 8, twod);
    }

    angle += 0.01;
    requestAnimationFrame(loop);
  });
}

window.addEventListener("load", main);