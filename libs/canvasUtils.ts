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