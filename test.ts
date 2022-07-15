function set(data: ImageData, x: number, y: number, rgb: number[]) {
  const idx = 4 * (Math.floor(x) + Math.floor(y) * data.width);
  data.data[idx] = rgb[0];
  data.data[idx + 1] = rgb[1];
  data.data[idx + 2] = rgb[2];
  data.data[idx + 3] = rgb[3] ?? 255;
}

function line(data: ImageData, x0: number, y0: number, x1: number, y1: number, rgb: number[]) {
  let isSteep = false;
  if (Math.abs(x0 - x1) < Math.abs(y0 - y1)) {
    ([x0, x1, y0, y1] = [y0, y1, x0, x1]); // Swap x, y coordinates
    isSteep = true;
  }
  if (x0 > x1) {
    ([x0, y0, x1, y1] = [x1, y1, x0, y0]); // Swap p1 and p2
  }
  for (let x = x0; x <= x1; x++) {
    let t = (x - x0) / (x1 - x0);
    let y = y0 * (1 - t) + t * y1;
    let idx = 4 * (isSteep ? y + x * data.width : x + y * data.width);
    data.data[idx] = rgb[0];
    data.data[idx + 1] = rgb[1];
    data.data[idx + 2] = rgb[2];
    data.data[idx + 3] = rgb[3] ?? 255;
  }
}

function triangle(data: ImageData, x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, rgb: number[]) {
  // Sort lower to upper y-coordinates
  if (y0 > y1) ([x0, y0, x1, y1] = [x1, y1, x0, y0]);
  if (y0 > y2) ([x0, y0, x2, y2] = [x2, y2, x0, y0]);
  if (y1 > y2) ([x1, y1, x2, y2] = [x2, y2, x1, y1]);
  let theight = y2 - y0, sheight = y1 - y0 + 1;
  for (let y = y0; y <= y1; y++) {
    let a = (y - y0) / theight;
    let b = (y - y0) / sheight;
    let ax = x0 + (x2 - x0) * a;
    let bx = x0 + (x1 - x0) * b;
    if (ax > bx) ([ax, bx] = [bx, ax]);
    for (let j = ax; j <= bx; j++) set(data, j, y, rgb);
  }
  sheight = y2 - y1 + 1;
  for (let y = y1; y <= y2; y++) {
    let a = (y - y0) / theight;
    let b = (y - y1) / sheight;
    let ax = x0 + (x2 - x0) * a;
    let bx = x1 + (x2 - x1) * b;
    if (ax > bx) ([ax, bx] = [bx, ax]);
    for (let j = ax; j <= bx; j++) set(data, j, y, rgb);
  }
}

function barycentric(points: number[][], P: number[]) {
  let u = [

  ];
}

function main() {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 800;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  triangle(data, 10, 70, 50, 160, 70, 80, [255, 50, 50]);
  ctx.putImageData(data, 0, 0);
}

window.addEventListener("load", main);