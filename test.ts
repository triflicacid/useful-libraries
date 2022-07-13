import { Matrix } from "./libs/maths/Matrix";
import { createCamera, createCube, createPyramid, createSphere, drawShape, IShape, moveShape, Point3D, transformShape } from "./libs/shapes";

function main() {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 800;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  const camera = createCamera(ctx, { fov: canvas.width * .7 });
  const shapes: IShape[] = [
    createCube(200),
    createSphere(125),
  ];
  const centres: Point3D[] = [
    [-150, 0, 0],
    [+150, 0, 0],
  ];
  let angle = 0;

  requestAnimationFrame(function loop() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = ctx.strokeStyle = "#ffffff";

    // TRANSFORM
    const transform = [
      Matrix.rotate3DX(-angle),
      Matrix.rotate3DY(-angle),
      Matrix.rotate3DZ(angle),
    ];

    for (let i = 0; i < shapes.length; i++) {
      let shape = transformShape(shapes[i], transform);
      moveShape(shape, centres[i]);
      drawShape(ctx, shape, camera);
    }

    angle = (angle + 0.01) % (2 * Math.PI);
    requestAnimationFrame(loop);
  });
}

window.addEventListener("load", main);