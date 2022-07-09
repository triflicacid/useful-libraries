/**
 * Given an cnavas containing an image, output a stringified version of that image
 * @param canvas Canvas image is contained in [0, 0] to [width, height]
 * @param chars Character set to use for different pixel brightnesses, light to dark
 */
export function imageToAscii(canvas: OffscreenCanvas, chars: string) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let string = "";
  for (let j = 0; j < image.height; j++) {
    for (let i = 0; i < image.width; i++) {
      const idx = (i + j * image.width) * 4;
      const r = image.data[idx];
      const g = image.data[idx + 1];
      const b = image.data[idx + 2];
      const bright = (r + g + b) / 3;
      const chidx = Math.round(bright / 255 * chars.length);
      let char = chars[chars.length - 1 - chidx];
      if (char === undefined) char = chars[chars.length - 1];
      string += char;
    }
    string += "\n";
  }
  return string;
}