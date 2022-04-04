import { IRec, IVec, sortPointsByAngleFromCentre } from "./utils";

/**
 * Creates a rectangle with rounded corners
 * This function only creates the path. Call fill() or stroke() after.
 * If bottomLeft is ommited, it is set to topLeft
 * If topRight is ommited, it is set to topLeft
 * If bottomRight is ommited, it is set to bottomRight
 */
export function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, topLeft: number, bottomLeft?: number, topRight?: number, bottomRight?: number) {
  if (bottomLeft === undefined) bottomLeft = topLeft;
  if (topRight === undefined) topRight = topLeft;
  if (bottomRight === undefined) bottomRight = bottomLeft;

  ctx.beginPath();
  // TOP LINE
  ctx.moveTo(x + topLeft, y);
  ctx.lineTo(x + width - topRight, y);
  // TOP-RIGHT
  ctx.quadraticCurveTo(x + width, y, x + width, y + topRight);
  // RIGHT LINE
  ctx.lineTo(x + width, y + height - bottomRight);
  // BOTTOM-LEFT
  ctx.quadraticCurveTo(x + width, y + height, x + width - bottomRight, y + height);
  // BOTTOM LINE
  ctx.lineTo(x + bottomLeft, y + height);
  // BOTTOM-RIGHT
  ctx.quadraticCurveTo(x, y + height, x, y + height - bottomRight);
  // LEFT LINE
  ctx.lineTo(x, y + topLeft);
  // TOP-LEFT
  ctx.quadraticCurveTo(x, y, x + topLeft, y);

  ctx.closePath();
}

export function drawArrow(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, aWidth: number, aLength: number, arrowStart = false, arrowEnd = true) {
  let dx = x1 - x0;
  let dy = y1 - y0;
  let angle = Math.atan2(dy, dx);
  let length = Math.sqrt(dx * dx + dy * dy);
  ctx.save();
  ctx.translate(x0, y0);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(length, 0);
  if (arrowStart) {
    ctx.moveTo(aLength, -aWidth);
    ctx.lineTo(0, 0);
    ctx.lineTo(aLength, aWidth);
  }
  if (arrowEnd) {
    ctx.moveTo(length - aLength, -aWidth);
    ctx.lineTo(length, 0);
    ctx.lineTo(length - aLength, aWidth);
  }
  ctx.stroke();
  ctx.restore();
}

/** Draw a rectange.
 * coord mode:
 *  0 -> coorinaes represent top-left. Extend x = w, y = h
 *  1 -> coordinates represent centre. Extend x = +-w/2, y = +-h/2
 * draw mode:
 *  1 -> stroke
 *  2 -> fill
 *  3 -> fill & stroke
*/
export function drawRect(ctx: CanvasRenderingContext2D, rec: IRec, coordMode: 0 | 1, drawMode: 1 | 2 | 3) {
  ctx.beginPath();
  if (coordMode === 0) ctx.rect(rec.x, rec.y, rec.w, rec.h);
  else if (coordMode === 1) ctx.rect(rec.x - rec.w / 2, rec.y - rec.h / 2, rec.w, rec.h);
  if (drawMode === 1 || drawMode === 3) ctx.stroke();
  if (drawMode === 2 || drawMode === 3) ctx.fill();
  ctx.closePath();
}

/** Draw polygon */
export function plotPolyon(ctx: CanvasRenderingContext2D, centre: IVec, ...points: IVec[]) {
  ({ points } = sortPointsByAngleFromCentre(centre, points));

  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.lineTo(points[0].x, points[0].y);
}