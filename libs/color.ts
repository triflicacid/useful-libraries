/** Scale a number <n> from range <inMin>-<inMax> to <outMin>-<outMax> presevring propertions */
export const nmap = (n: number, inMin: number, inMax: number, outMin: number, outMax: number) => (n - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

/** Clamp a number within a range (inc) */
export const clamp = (n: number, min: number, max: number) => {
  if (n < min) return min;
  if (n > max) return max;
  return n;
};

/** Color formats which are represented as numefical arrays */
type NColorFormat = "rgb" | "rgba" | "hsl" | "hsv" | "cmyk";
type ColorFormat = NColorFormat | "hex" | "hexa" | "css";

/**
 * Given color format and array of values, return values in correct domain
 */
export function clampValues(format: NColorFormat, values: number[]) {
  switch (format) {
    case "rgb":
      return values.map(n => clamp(n, 0, 255));
    case "rgba":
      return [clamp(values[0], 0, 255), clamp(values[1], 0, 255), clamp(values[2], 0, 255), clamp(values[3], 0, 1)];
    case "hsl":
    case "hsv":
      return [clamp(values[0], 0, 360), clamp(values[1], 0, 100), clamp(values[2], 0, 100)];
    case "cmyk":
      return values.map(x => clamp(x, 0, 100));
    default:
      return values;
  }
}

/** Given a color format, return string representation */
export function col2str(format: NColorFormat, values: number[], dp = 2): string {
  values = clampValues(format, values).map(n => +n.toFixed(dp));
  switch (format) {
    case "rgb":
      return "rgb(" + values.join(", ") + ")";
    case "rgba":
      return "rgba(" + values.join(", ") + ")";
    case "hsl":
      return `hsl(${values[0]}, ${values[1]}%, ${values[2]}%)`;
    case "hsv":
      return `hsv(${values[0]}, ${values[1]}%, ${values[2]}%)`;
    case "cmyk":
      return "cmyk(" + values.map(x => x + "%").join(", ") + ")";
    default:
      return "";
  }
}

/**
 * Convert RGB to Hex
 * @params r: red range [0, 255]
 * @params g: green range [0, 255]
 * @params b: blue range [0, 255]
 * @returns hex: #RRGGBB
 */
export function rgb2hex(r: number, g: number, b: number): string {
  return '#' + Math.floor(clamp(r, 0, 255)).toString(16).padStart(2, '0') + Math.floor(clamp(g, 0, 255)).toString(16).padStart(2, '0') + Math.floor(clamp(b, 0, 255)).toString(16).padStart(2, '0');
}

/**
 * Convert RGBA to Hex-Alpha
 * @params r: red range [0, 255]
 * @params g: green range [0, 255]
 * @params b: blue range [0, 255]
 * @params a: alpha range [0, 1]
 * @returns hex: #RRGGBBAA
 */
export function rgba2hexa(r: number, g: number, b: number, a: number): string {
  return '#' + Math.floor(clamp(r, 0, 255)).toString(16).padStart(2, '0') + Math.floor(clamp(g, 0, 255)).toString(16).padStart(2, '0') + Math.floor(clamp(b, 0, 255)).toString(16).padStart(2, '0') + Math.floor(nmap(clamp(a, 0, 1), 0, 1, 0, 255)).toString(16).padStart(2, '0');
}

/**
 * Convert Hex to RGB
 * @param hex - #RRGGBB
 * @returns RGB:[r [0, 255], g [0, 255], b [0, 255]]
*/
export function hex2rgb(hex: string): number[] {
  let rgb: string[] = hex.length === 4 ? hex.substring(1).match(/[0-9A-Fa-f]/g).map(x => x + x) : hex.substring(1).match(/[0-9A-Fa-f]{2}/g);
  return rgb.map(hex => clamp(parseInt(hex, 16), 0, 255));
}

/**
 * Convert Hex-Alpha to RGBA
 * @param hexa - #RRGGBBAA
 * @returns RGB: [r [0, 255], g [0, 255], b [0, 255], a [0, 1]]
*/
export function hexa2rgba(hexa: string): number[] {
  let parts: string[] = hexa.length === 5 ? hexa.substring(1).match(/[0-9A-Fa-f]/g).map(x => x + x) : hexa.substring(1).match(/[0-9A-Fa-f]{2}/g);
  let rgba = parts.map(hex => clamp(parseInt(hex, 16), 0, 255));
  rgba[3] = nmap(rgba[3], 0, 255, 0, 1);
  return rgba;
}

/**
 * Convert RGB to HSL
 * @params r: red range [0, 255]
 * @params g: green range [0, 255]
 * @params b: blue range [0, 255]
 * @returns hsl: [h [0, 360], s [0, 100], l [0, 100]]
 */
export function rgb2hsl(r: number, g: number, b: number): number[] {
  r = clamp(r, 0, 255) / 255;
  g = clamp(g, 0, 255) / 255;
  b = clamp(b, 0, 255) / 255;
  let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin;
  let h = 0, s = 0, l = 0;
  if (delta === 0) h = 0;
  else if (cmax === r) h = 60 * (((g - b) / delta) % 60);
  else if (cmax === g) h = 60 * ((b - r) / delta + 2);
  else h = 60 * ((r - g) / delta + 4);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return [h, s * 100, l * 100];
}

/**
 * Convert HSL to RGB
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100]
 * @params l: lightness range [0, 100]
 * @returns rgb: [r [0, 255], g [0, 255], b [0, 255]]
 */
export function hsl2rgb(h: number, s: number, l: number): number[] {
  h = clamp(h, 0, 360);
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, rgb: number[];
  if (0 <= h && h < 60) rgb = [c, x, 0];
  else if (60 <= h && h < 120) rgb = [x, c, 0];
  else if (120 <= h && h < 180) rgb = [0, c, x];
  else if (180 <= h && h < 240) rgb = [0, x, c];
  else if (240 <= h && h < 300) rgb = [x, 0, c];
  else if (300 <= h && h < 360) rgb = [c, 0, x];
  return rgb.map(n => (n + m) * 255);
}

/**
 * Convert CSS color to RGBA
 * @params css - css color string
 * @returns rgba: [r [0, 255], g [0, 255], b [0, 255], a [0, 1]]
 */
export function css2rgb(css: string): number[] {
  const div = document.createElement('div');
  document.body.appendChild(div);
  div.style.color = css;
  let prop = getComputedStyle(div).getPropertyValue("color");
  div.remove();
  return prop.substring(prop.indexOf("(") + 1, prop.length - 1).split(",").map(x => +x.trim());
}

/**
 * Convert RGB to CMYK
 * @params r: red range [0, 255]
 * @params g: green range [0, 255]
 * @params b: blue range [0, 255]
 * @returns cmyk: [c [0, 100], m [0, 100], y [0, 100], k [0, 100]]
 */
export function rgb2cmyk(r: number, g: number, b: number): number[] {
  r = clamp(r === 0 ? 1 : r, 0, 255) / 255;
  g = clamp(g === 0 ? 1 : g, 0, 255) / 255;
  b = clamp(b === 0 ? 1 : b, 0, 255) / 255;
  let k = 1 - Math.max(r, g, b);
  return [((1 - r - k) / (1 - k)) * 100, ((1 - g - k) / (1 - k)) * 100, ((1 - b - k) / (1 - k)) * 100, k * 100];
}

/**
 * Convert CMYK to RGB
 * @params c: cyan range [0, 100]
 * @params m: meganta range [0, 100]
 * @params y: yellow range [0, 100]
 * @params k: black range [0, 100]
 * @returns rgb: [r [0, 255], g [0, 255], b [0, 255]]
 */
export function cmyk2rgb(c: number, m: number, y: number, k: number): number[] {
  ([c, m, y, k] = [c, m, y, k].map(n => clamp(n, 0, 100) / 100)); // [0, 100] -> [0, 1]
  return [255 * (1 - c) * (1 - k), 255 * (1 - m) * (1 - k), 255 * (1 - y) * (1 - k)];
}

/**
 * Convert RGB to HSV
 * @params r: red range [0, 255]
 * @params g: green range [0, 255]
 * @params b: blue range [0, 255]
 * @returns hsv: [h [0, 360], s [0, 100], v [0, 100]]
 */
export function rgb2hsv(r: number, g: number, b: number): number[] {
  r = clamp(r, 0, 255) / 255;
  g = clamp(g, 0, 255) / 255;
  b = clamp(b, 0, 255) / 255;
  let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin;
  let h = 0, s = 0, v = cmax;
  if (delta === 0) h = 0;
  else if (cmax === r) h = 60 * (((g - b) / delta) % 60);
  else if (cmax === g) h = 60 * ((b - r) / delta + 2);
  else h = 60 * ((r - g) / delta + 4);
  if (h < 0) h += 360;
  s = cmax === 0 ? 0 : delta / cmax;
  return [h, s * 100, v * 100];
}

/**
 * Convert HSV to RGB
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100]
 * @params v: value range [0, 100]
 * @returns rgb: [r [0, 255], g [0, 255], b [0, 255]]
 */
export function hsv2rgb(h: number, s: number, v: number): number[] {
  h = clamp(h, 0, 360);
  s = clamp(s, 0, 100) / 100;
  v = clamp(v, 0, 100) / 100;
  let c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
  let rgb: number[];
  if (0 <= h && h < 60) rgb = [c, x, 0];
  else if (60 <= h && h < 120) rgb = [x, c, 0];
  else if (120 <= h && h < 180) rgb = [0, c, x];
  else if (180 <= h && h < 240) rgb = [0, x, c];
  else if (240 <= h && h < 300) rgb = [x, 0, c];
  else if (300 <= h && h < 360) rgb = [c, 0, x];
  return rgb.map(n => (n + m) * 255);
}

/**
 * Convert HSL to HSV
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100]
 * @params l: lightness range [0, 100]
 * @returns hsv: [h [0, 360], s [0, 100], v [0, 100]]
 */
export function hsl2hsv(h: number, s: number, l: number): number[] {
  h = clamp(h, 0, 360);
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  let v = s * Math.min(l, 1 - l) + l;
  return [h, (v === 0 ? 0 : 2 * (1 - l / v)) * 100, v * 100];
}

/**
 * Convert HSV to HSL
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100]
 * @params v: value range [0, 100]
 * @returns hsl: [h [0, 360], s [0, 100], l [0, 100]]
 */
export function hsv2hsl(h: number, s: number, v: number): number[] {
  h = clamp(h, 0, 360);
  s = clamp(s, 0, 100) / 100;
  v = clamp(v, 0, 100) / 100;
  let l = v * (1 - s / 2), m = Math.min(l, 1 - l);
  return [h, (l === 0 || l === 1 ? 0 : (v - l) / m * 100), l * 100];
}