import { Matrix } from "./maths/Matrix";

export type Point3D = [number, number, number];
export type Point2D = [number, number];

/** 3D to 2D perspective */
export interface ICamera {
  /** X ordinate of 'camera' */
  cx: number;
  /** Y ordinate of 'camera' */
  cy: number;
  /** Z ordinate of 'camera' */
  cz: number;
  /** Maximum observable distance from camera */
  fov: number;
  /** Scale shapes? */
  scale?: boolean;
}

/** Return camera object, with some given options */
export function createCamera(ctx: CanvasRenderingContext2D, opts: { [opt: string]: any } = {}) {
  return {
    cx: opts.cx ?? (ctx.canvas.width / 2),
    cy: opts.cy ?? (ctx.canvas.height / 2),
    cz: opts.cz ?? 0,
    fov: opts.fov ?? (ctx.canvas.width * 0.75),
    scale: opts.scale ?? true,
  } as ICamera;
}

/** Enumeration of all shape types */
export enum ShapeType {
  Cube,
  Cuboid,
  Polygon,
  Prism,
  Pyramid,
  Rectangle,
  Sphere,
}

export interface IShape {
  /** Shape type */
  type: ShapeType;
  /** Co-ordinates <x,y,z> of shape centre */
  centre: Point3D;
  vertices: Point3D[];
}

/** Describes a rectangle */
export interface IRectangle extends IShape {
  width: number;
  height: number;
}

/**
 * Create a square centred around `<0,0,0>`
 * @param sideLength The length of each side (default=1)
 */
export function createSquare(sideLength = 1): IRectangle {
  let t = sideLength / 2;
  return {
    type: ShapeType.Rectangle,
    centre: [0, 0, 0],
    width: sideLength,
    height: sideLength,
    vertices: [
      [-t, -t, 0],
      [+t, -t, 0],
      [-t, +t, 0],
      [+t, +t, 0],
    ],
  };
}

/**
 * Create a rectangle centred around `<0,0,0>`
 * @param width Width of rectangle (default=1)
 * @param height Height of rectangle (default=2)
 */
export function createRectangle(width = 1, height = 2): IRectangle {
  const w2 = width / 2, h2 = height / 2;
  return {
    type: ShapeType.Rectangle,
    centre: [0, 0, 0],
    width, height,
    vertices: [
      [-w2, -h2, 0],
      [+w2, -h2, 0],
      [-w2, +h2, 0],
      [+w2, +h2, 0],
    ],
  };
}

/**
 * Render a square/rectangle
 * @param ctx canvas to draw to
 * @param rect points describing the cube
 * @param cam camera viewing from
 * @param vertexRadius radius of each vertex. If == 0, doesn't draw vertices
 */
export function drawRectangle(ctx: CanvasRenderingContext2D, rect: IRectangle, cam: ICamera, vertexRadius = 0) {
  const points = projectPoints(rect.vertices, cam);

  // Connect Faces
  line(ctx, 0, 1, points);
  line(ctx, 0, 2, points);
  line(ctx, 3, 1, points);
  line(ctx, 3, 2, points);

  // Vertices
  if (vertexRadius > 0)
    for (const P of points)
      if (P[2] > 0) {
        ctx.beginPath();
        ctx.arc(P[0], P[1], vertexRadius * P[2], 0, 6.3);
        ctx.fill();
      }
}

/** Describes a cube */
export interface ICube extends IShape {
  /** Side lengths of cube */
  sides: number;
}

/**
 * Create a cube centred around `<0,0,0>`
 * @param sideLength The length of each side (default=1)
 */
export function createCube(sideLength = 1): ICube {
  let t = sideLength / 2;
  return {
    type: ShapeType.Cube,
    centre: [0, 0, 0],
    sides: sideLength,
    vertices: [
      [-t, -t, -t],
      [+t, -t, -t],
      [-t, +t, -t],
      [+t, +t, -t],

      [-t, -t, +t],
      [+t, -t, +t],
      [-t, +t, +t],
      [+t, +t, +t],
    ],
  };
}

/** Describes a cuboid */
export interface ICuboid extends IShape {
  height: number;
  length: number;
  depth: number;
}

/**
 * Create a cuboid centred around `<0,0,0>`
 * @param height The height of the cuboid (default=1)
 * @param length The length of the cuboid (default=1)
 * @param depth The depth of the cuboid (default=1)
 */
export function createCuboid(height = 1, length = 1, depth = 1): ICuboid {
  let h2 = height / 2, l2 = length / 2, d2 = depth / 2;
  return {
    type: ShapeType.Cuboid,
    centre: [0, 0, 0],
    height, length, depth,
    vertices: [
      [-l2, -h2, -d2],
      [+l2, -h2, -d2],
      [-l2, +h2, -d2],
      [+l2, +h2, -d2],

      [-l2, -h2, +d2],
      [+l2, -h2, +d2],
      [-l2, +h2, +d2],
      [+l2, +h2, +d2],
    ],
  };
}

/**
 * Render a cuboid/cube
 * @param ctx canvas to draw to
 * @param cuboid points describing the cube
 * @param cam camera viewing from
 * @param vertexRadius radius of each vertex. If == 0, doesn't draw vertices
 */
export function drawCuboid(ctx: CanvasRenderingContext2D, cuboid: ICube | ICuboid, cam: ICamera, vertexRadius = 0) {
  const points = projectPoints(cuboid.vertices, cam);

  // Connect Faces
  for (let i = 0; i < 2; i++) {
    const k = 4 * i;
    line(ctx, k + 0, k + 1, points);
    line(ctx, k + 0, k + 2, points);
    line(ctx, k + 3, k + 1, points);
    line(ctx, k + 3, k + 2, points);
  }
  // Connect edges
  for (let i = 0; i < 4; i++) line(ctx, i, i + 4, points);

  // Vertices
  vertexRadius = 4;
  if (vertexRadius > 0)
    for (const P of points)
      if (P[2] > 0) {
        ctx.beginPath();
        ctx.arc(P[0], P[1], vertexRadius * P[2], 0, 6.3);
        ctx.fill();
      }
}

/** Describe a polygon */
export interface IPolygon extends IShape {
  radius: number;
}

export function createPolygon(vertices: number, radius: number): IPolygon {
  let phi = (2 * Math.PI) / vertices;
  return {
    type: ShapeType.Polygon,
    centre: [0, 0, 0],
    radius,
    vertices: Array.from({ length: vertices }, (_, i) => ([radius * Math.cos(i * phi), radius * Math.sin(i * phi), 0])),
  };
}

/**
 * Render a polygon
 * @param ctx canvas to draw to
 * @param polygon points describing the polygon
 * @param cam camera viewing from
 * @param vertexRadius radius of each vertex. If == 0, doesn't draw vertices
 */
export function drawPolygon(ctx: CanvasRenderingContext2D, polygon: IPolygon, cam: ICamera, vertexRadius = 0) {
  const points = projectPoints(polygon.vertices, cam);

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 0; i < points.length; ++i) ctx.lineTo(points[i][0], points[i][1]);
  ctx.lineTo(points[0][0], points[0][1]);
  ctx.stroke();

  // Vertices
  if (vertexRadius > 0)
    for (const P of points)
      if (P[2] > 0) {
        ctx.beginPath();
        ctx.arc(P[0], P[1], vertexRadius * P[2], 0, 6.3);
        ctx.fill();
      }
}

/** Describe a prism */
export interface IPrism extends IShape {
  radius: number;
  depth: number;
}

export function createPrism(vertices: number, radius: number, depth: number): IPrism {
  const phi = (2 * Math.PI) / vertices, d2 = depth / 2;
  const front: Point3D[] = [], back: Point3D[] = [];
  for (let i = 0; i < vertices; i++) {
    let theta = i * phi, x = radius * Math.cos(theta), y = radius * Math.sin(theta);
    front[i] = [x, y, +d2];
    back[i] = [x, y, -d2];
  }
  return {
    type: ShapeType.Prism,
    centre: [0, 0, 0],
    radius, depth,
    vertices: front.concat(back),
  };
}

/**
 * Render a prism
 * @param ctx canvas to draw to
 * @param prism points describing the prism
 * @param cam camera viewing from
 * @param vertexRadius radius of each vertex. If == 0, doesn't draw vertices
 */
export function drawPrism(ctx: CanvasRenderingContext2D, prism: IPrism, cam: ICamera, vertexRadius = 0) {
  const points = projectPoints(prism.vertices, cam);

  let n = points.length / 2;
  // Each face
  ctx.beginPath();
  for (let j = 0, k = 0; j < 2; j++, k += n) {
    ctx.moveTo(points[k][0], points[k][1]);
    for (let i = 0; i < n; ++i) ctx.lineTo(points[k + i][0], points[k + i][1]);
    ctx.lineTo(points[k][0], points[k][1]);
  }
  // Connect faces
  for (let i = 0; i < n; i++) {
    ctx.moveTo(points[i][0], points[i][1]);
    ctx.lineTo(points[i + n][0], points[n + i][1]);
  }
  ctx.stroke();

  // Vertices
  if (vertexRadius > 0)
    for (const P of points)
      if (P[2] > 0) {
        ctx.beginPath();
        ctx.arc(P[0], P[1], vertexRadius * P[2], 0, 6.3);
        ctx.fill();
      }
}

/** Describe a pyramid */
export interface IPyramid extends IShape {
  /** Radius of polygon base */
  radius: number;
  /** Vertical height to apex */
  height: number;
}

/**
 * Create a polygon-based pyramid
 * @param order Number if vertices the polygon base will have
 * @param radius Radius of the polygon base
 * @param height vertical height to the apex
 */
export function createPyramid(order: number, radius: number, height: number): IPyramid {
  let phi = (2 * Math.PI) / order;
  const vertices: Point3D[] = [];
  for (let i = 0, a = 0; i < order; i++, a += phi) {
    vertices[i] = [radius * Math.cos(i * phi), radius * Math.sin(i * phi), 0];
  }
  vertices[order] = [0, 0, -height]; // Apex
  return {
    type: ShapeType.Pyramid,
    centre: [0, 0, 0],
    radius, height, vertices,
  }
}

/**
 * Render a pyramid
 * @param ctx canvas to draw to
 * @param pyramid points describing the pyramid
 * @param cam camera viewing from
 * @param vertexRadius radius of each vertex. If == 0, doesn't draw vertices
 */
export function drawPyramid(ctx: CanvasRenderingContext2D, pyramid: IPyramid, cam: ICamera, vertexRadius = 0) {
  const points = projectPoints(pyramid.vertices, cam);

  // Draw base
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 0; i < points.length - 1; ++i) ctx.lineTo(points[i][0], points[i][1]);
  ctx.lineTo(points[0][0], points[0][1]);
  for (let i = 0, apex = points[points.length - 1]; i < points.length - 1; ++i) {
    ctx.moveTo(apex[0], apex[1]);
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.stroke();

  // Connect to top

  // Vertices
  if (vertexRadius > 0)
    for (const P of points)
      if (P[2] > 0) {
        ctx.beginPath();
        ctx.arc(P[0], P[1], vertexRadius * P[2], 0, 6.3);
        ctx.fill();
      }
}

/** Describes a sphere */
export interface ISphere extends IShape {
  radius: number;
  /** Smoothness of the sphere: sqrt(vertices.length) - 1 */
  smoothness: number;
}

/**
 * Create a sphere centred around `<0,0,0>`
 * @param radius Radius if the sphere
 * @param smoothness Sphere's outer smoothness (default=32)
 */
export function createSphere(radius: number, smoothness = 32): ISphere {
  const latInc = Math.PI / smoothness, lonInc = (2 * Math.PI) / smoothness;
  const vertices: Point3D[] = [];
  // sphere[0] = [0, 0, 0]; // Mark the centre
  for (let i = 0, lat = -Math.PI / 2; i <= smoothness; i++, lat += latInc) {
    for (let j = 0, lon = -Math.PI; j <= smoothness; j++, lon += lonInc) {
      vertices.push([
        radius * Math.sin(lon) * Math.cos(lat),
        radius * Math.sin(lon) * Math.sin(lat),
        radius * Math.cos(lon),
      ]);
    }
  }
  return {
    type: ShapeType.Sphere,
    centre: [0, 0, 0],
    vertices, radius, smoothness
  };
}

/** SPHERE: CONNECT ALONG LATITUDE */
export const SPHERE_CONNECT_LON = 1;

/** SPHERE: CONNECT ALONG LONGITUDE */
export const SPHERE_CONNECT_LAT = 2;

/**
 * Draw a sphere
 * @param ctx Canvas context to render to
 * @param sphere Sphere to draw
 * @param cam Camera to draw from
 * @param connect How to connect each point (combination of `SPHERE_CONNECT_LON`, `SPHERE_CONNECT_LAT`)
 * @param vertexRadius Radius of each vertex (do not raw if <= 0)
 */
export function drawSphere(ctx: CanvasRenderingContext2D, sphere: ISphere, cam: ICamera, connect: number = SPHERE_CONNECT_LAT, vertexRadius = 0) {
  const points = projectPoints(sphere.vertices, cam), dim = sphere.smoothness;
  if (connect === (SPHERE_CONNECT_LAT | SPHERE_CONNECT_LON)) {
    for (let j = 0; j <= dim; j++) {
      ctx.beginPath();
      let p0 = points[j];
      ctx.moveTo(p0[0], p0[1]);
      for (let i = 0; i <= dim; i++) {
        const p1 = points[j + i * (dim + 1)];
        ctx.lineTo(p1[0], p1[1]);
      }
      p0 = points[j * (dim + 1)];
      ctx.moveTo(p0[0], p0[1]);
      for (let i = 0; i <= dim; i++) {
        const p1 = points[i + j * (dim + 1)];
        ctx.lineTo(p1[0], p1[1]);
      }
      ctx.stroke();
    }
  } else if (connect === SPHERE_CONNECT_LAT) {
    for (let j = 0; j <= dim; j++) {
      ctx.beginPath();
      const p0 = points[j];
      ctx.moveTo(p0[0], p0[1]);
      for (let i = 0; i <= dim; i++) {
        const p1 = points[j + i * (dim + 1)];
        ctx.lineTo(p1[0], p1[1]);
      }
      ctx.stroke();
    }
  } else if (connect === SPHERE_CONNECT_LON) {
    for (let i = 0; i <= dim; i++) {
      ctx.beginPath();
      const p0 = points[i * (dim + 1)];
      ctx.moveTo(p0[0], p0[1]);
      for (let j = 1; j <= dim; j++) {
        const p1 = points[j + i * (dim + 1)];
        ctx.lineTo(p1[0], p1[1]);
      }
      ctx.stroke();
    }
  }

  // Vertices
  if (vertexRadius > 0)
    for (const P of points)
      if (P[2] > 0) {
        ctx.beginPath();
        ctx.arc(P[0], P[1], vertexRadius * P[2], 0, 6.3);
        ctx.fill();
      }
}

/** Given array of 3D points, return [x', y', scale] */
export function projectPoints(points: Point3D[], cam: ICamera) {
  const newPoints: [number, number, number][] = []; // Each point: '[x, y, scale]'
  for (let point of points) {
    const s = cam.scale ? cam.fov / (cam.fov + point[2]) : 1;
    let u = s * point[0] + cam.cx, v = s * point[1] + cam.cy;
    newPoints.push([u, v, s]);
  }
  // newPoints.sort((a, b) => a[2] - b[2]); // Sort farthest to nearest
  return newPoints;
}

/**
 * Given a shape, draw it to the provided context
 * @param ctx Canvas context to draw to
 * @param shape Shape object to draw
 * @param cam Camera
 * @param vertexRadius Radius of each vertex (only draw if >0)
 */
export function drawShape<T extends IShape>(ctx: CanvasRenderingContext2D, shape: T, cam: ICamera, vertexRadius = 0) {
  switch (shape.type) {
    case ShapeType.Cube:
    case ShapeType.Cuboid:
      return drawCuboid(ctx, shape as any, cam, vertexRadius);
    case ShapeType.Polygon:
      return drawPolygon(ctx, shape as any, cam, vertexRadius);
    case ShapeType.Prism:
      return drawPrism(ctx, shape as any, cam, vertexRadius);
    case ShapeType.Pyramid:
      return drawPyramid(ctx, shape as any, cam, vertexRadius);
    case ShapeType.Rectangle:
      return drawRectangle(ctx, shape as any, cam, vertexRadius);
    case ShapeType.Sphere:
      return drawSphere(ctx, shape as any, cam, SPHERE_CONNECT_LAT | SPHERE_CONNECT_LON, vertexRadius);
  }
}

/** Translate (move) shape by `<tx,ty,tz>` (mutates original shape) */
export function translateShape<T extends IShape>(shape: T, shift: Point3D) {
  for (let i = 0; i < shift.length; i++) shape.centre[i] += shift[i];
  for (let i = 0; i < shape.vertices.length; i++) for (let j = 0; j < shift.length; j++) shape.vertices[i][j] += shift[j];
}

/** Move shape's centre to `<cx,cy,cz>` (mutates original shape) */
export function moveShape<T extends IShape>(shape: T, centre: Point3D) {
  let shift = centre.map((_, i) => centre[i] - shape.centre[i]);
  for (let i = 0; i < centre.length; i++) shape.centre[i] = centre[i];
  for (let i = 0; i < shape.vertices.length; i++) for (let j = 0; j < shift.length; j++) shape.vertices[i][j] += shift[j];
}

/** Return a deepcopy of given shape, ignoring property names given in array */
export function deepcopyShape<T extends IShape>(shape: T, propertiesIgnore: (keyof T)[] = []) {
  const copy = {} as T;
  for (let prop in shape) {
    if (propertiesIgnore.includes(prop)) continue;
    if (Array.isArray(shape[prop])) copy[prop] = deepcopyArray(shape[prop] as any) as any;
    else copy[prop] = shape[prop];
  }
  return copy;
}

/** Apply array of transformation matrices to a shape (return a new shape). Iterating array from i=0, multiply each point by the matrix: M P = P' */
export function transformShape<T extends IShape>(shape: T, transformations: Matrix[]) {
  const newShape = deepcopyShape(shape, ["vertices"]);
  newShape.vertices = [];
  for (let point of shape.vertices) {
    let matrix = Matrix.fromVector(...point);
    for (let T of transformations) matrix = Matrix.mult(T, matrix);
    point = matrix.toVector() as Point3D;
    newShape.vertices.push(point);
  }
  return newShape;
}

/** Draw array of 3D points (circles) */
export function drawPoints(ctx: CanvasRenderingContext2D, points: Point2D[], radius = 3) {
  for (let point of points) {
    ctx.beginPath();
    ctx.arc(point[0], point[1], radius, 0, 6.3);
    ctx.fill();
  }
}

/** Connect array of 3D points */
export function drawPointsConnected(ctx: CanvasRenderingContext2D, points: Point2D[]) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.lineTo(points[0][0], points[0][1]);
  ctx.stroke();
}

/**
 * Draw points as pixels in given ImageData
 * @param data ImageData from CanvasRenderingContext2D
 * @param points Array of 2D points (use projectPoints)
 * @param dx Offset X of ImageData
 * @param dy Offset Y of ImageData
 * @param rgb RGB(A) to colour each pixel
 */
export function drawPixels(data: ImageData, points: Point3D[], dx: number, dy: number, rgb: number[]) {
  for (let point of points) {
    let idx = 4 * (Math.floor(point[0] - dx) + Math.floor(point[1] - dy) * data.width);
    data.data[idx] = rgb[0];
    data.data[idx + 1] = rgb[1];
    data.data[idx + 2] = rgb[2];
    data.data[idx + 3] = rgb[3] ?? 255;
  }
}

/** Draw a line between two given points (`points[i]` and `points[j]`) */
function line(ctx: CanvasRenderingContext2D, i: number, j: number, points: number[][]) {
  ctx.beginPath();
  ctx.moveTo(points[i][0], points[i][1]);
  ctx.lineTo(points[j][0], points[j][1]);
  ctx.stroke();
}

/** Draw a line between two given points (`points[i]` and `points[j]`) in pixels (using Bresenham’s Line Drawing Algorithm) */
function linePixels(data: ImageData, i: number, j: number, points: number[][], rgb: number[]) {
  let x0 = Math.floor(points[i][0]), y0 = Math.floor(points[i][1]);
  let x1 = Math.floor(points[j][0]), y1 = Math.floor(points[j][1]);

  let steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
  if (steep) {
    let tmp: number;
    tmp = x0; x0 = y0; y0 = tmp;
    tmp = x1; x1 = y1; y1 = tmp;
  }
  if (x0 > x1) {
    let tmp: number;
    tmp = x0; x0 = x1; x1 = tmp;
    tmp = y0; y0 = y1; y1 = tmp;
  }

  let yStep = y0 < y1 ? 1 : -1;
  let deltaX = x1 - x0;
  let deltaY = Math.abs(y1 - y0);
  let error = 0;

  let index = 0;
  let y = y0;
  for (let x = x0; x <= x1; x++) {
    // index is vertical coordinate times width, plus horizontal coordinate, times 4 because every pixel consists of 4 bytes
    if (steep) index = (x * data.width + y) * 4; // y, x
    else index = (y * data.width + x) * 4; // x, y
    data[index] = rgb[0];
    data[index + 1] = rgb[1];
    data[index + 2] = rgb[2];
    data[index + 3] = rgb[3] ?? 255;
    error += deltaY;
    if ((error << 1) >= deltaX) {
      y += yStep;
      error -= deltaX;
    }
  }
}

/** Deepcopy an array */
function deepcopyArray(array: any[]) {
  const copy: any[] = [];
  for (let i = 0; i < array.length; i++) copy[i] = Array.isArray(array[i]) ? deepcopyArray(array[i]) : array[i];
  return copy;
}