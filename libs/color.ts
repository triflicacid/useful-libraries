/** Scale a number <n> from range <inMin>-<inMax> to <outMin>-<outMax> presevring propertions */
export const nmap = (n: number, inMin: number, inMax: number, outMin: number, outMax: number) => (n - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

/** Clamp a number within a range (inc) */
export const clamp = (n: number, min: number, max: number) => {
  if (n < min) return min;
  if (n > max) return max;
  return n;
};

/** Get coordinates from event over event.target */
export function extractCoords(event: MouseEvent) {
  const box = (<HTMLElement>event.target).getBoundingClientRect();
  return [event.clientX - box.left, event.clientY - box.top];
}

/** Color formats which are represented as numefical arrays */
export type NColorFormat = "rgb" | "rgba" | "hsl" | "hsv" | "cmyk" | "cmy" | "xyz" | "xyY" | "lab" | "lch" | "hlab" | "lms";
/** Numeric data for NColorFormat */
export type NColorData = [number, number, number] | [number, number, number, number];
/** Convert NColor to RGB */
export type NColorToRGBFunc = ((a: number, b: number, c: number) => [number, number, number]) | ((a: number, b: number, c: number, d: number) => [number, number, number]);
export type ColorFormat = NColorFormat | "hex" | "hexa" | "css";

/**
 * Given color format and array of values, return values in correct domain
 */
export function clampValues(format: NColorFormat | string, values: number[]) {
  switch (format) {
    case "rgb":
      return values.map(n => clamp(n, 0, 255));
    case "rgba":
      return [clamp(values[0], 0, 255), clamp(values[1], 0, 255), clamp(values[2], 0, 255), clamp(values[3], 0, 1)];
    case "hsl":
    case "hsv":
      return [clamp(values[0], 0, 360), clamp(values[1], 0, 100), clamp(values[2], 0, 100)];
    case "cmyk":
    case "cmy":
      return values.map(x => clamp(x, 0, 100));
    default:
      return values;
  }
}

/** Given a color format, return string representation */
export function col2str(format: NColorFormat | string, values: NColorData, dp = 2): string {
  values = clampValues(format, values).map(n => isFinite(dp) ? +n.toFixed(dp) : n) as NColorData;
  switch (format) {
    case "hsl":
      return `hsl(${values[0]}°, ${values[1]}%, ${values[2]}%)`;
    case "hsv":
      return `hsv(${values[0]}°, ${values[1]}%, ${values[2]}%)`;
    case "cmyk":
      return "cmyk(" + values.map(x => x + "%").join(", ") + ")";
    case "cmy":
      return "cmy(" + values.map(x => x + "%").join(", ") + ")";
    case "lch":
      return `lch(${values[0]}, ${values[1]}, ${values[2]}°)`;
    default:
      return format + "(" + values.join(", ") + ")";
  }
}

/**
 * Convert between color models. Works by converting start -> rgb -> end.
 * 
 * As such, some conversions may be slow e.g. "xyz -> lms" employs "xyz -> rgb -> xyz -> lms" where siimply using the function `xyz2lms` would be more efficient
 */
export function col2col<U extends string | NColorData, V extends string | NColorData>(data: U, cfrom: ColorFormat, cto: ColorFormat): V {
  if (cfrom === cto) return data as unknown as V;
  let rgb: [number, number, number];
  switch (cfrom) {
    case "rgb":
    case "rgba":
      rgb = data as any;
      break;
    case "hex":
      rgb = hex2rgb(data as string);
      break;
    case "hexa":
      rgb = hexa2rgba(data as string).slice(0, 3) as [number, number, number];
      break;
    case "css":
      rgb = css2rgb(data as string).slice(0, 3) as [number, number, number];
      break;
    case "hsl":
      rgb = hsl2rgb(...(data as [number, number, number]));
      break;
    case "hsv":
      rgb = hsv2rgb(...(data as [number, number, number]));
      break;
    case "cmyk":
      rgb = cmyk2rgb(...(data as [number, number, number, number]));
      break;
    case "cmy":
      rgb = cmy2rgb(...(data as [number, number, number]));
      break;
    case "xyz":
      rgb = xyz2rgb(...(data as [number, number, number]));
      break;
    case "xyY":
      rgb = xyz2rgb(...xyY2xyz(...(data as [number, number, number])));
      break;
    case "lab":
      rgb = xyz2rgb(...lab2xyz(...(data as [number, number, number])));
      break;
    case "lch":
      rgb = xyz2rgb(...lab2xyz(...lch2lab(...(data as [number, number, number]))));
      break;
    case "hlab":
      rgb = xyz2rgb(...hlab2xyz(...(data as [number, number, number])));
      break;
    case "lms":
      rgb = xyz2rgb(...lms2xyz(...(data as [number, number, number])));
      break;
    default:
      rgb = [0, 0, 0];
  }
  switch (cto) {
    case "rgb":
    case "rgba":
      return rgb as V;
    case "hex":
    case "css":
      return rgb2hex(...rgb) as V;
    case "hexa":
      return (rgb2hex(...rgb) + "ff") as V;
    case "hsl":
      return rgb2hsl(...rgb) as V;
    case "hsv":
      return rgb2hsv(...rgb) as V;
    case "cmyk":
      return rgb2cmyk(...rgb) as V;
    case "cmy":
      return rgb2cmy(...rgb) as V;
    case "xyz":
      return rgb2xyz(...rgb) as V;
    case "xyY":
      return xyz2xyY(...rgb2xyz(...rgb)) as V;
    case "lab":
      return xyz2lab(...rgb2xyz(...rgb)) as V;
    case "lch":
      return lab2lch(...(xyz2lab(...rgb2xyz(...rgb)))) as V;
    case "hlab":
      return xyz2hlab(...rgb2xyz(...rgb)) as V;
    case "lms":
      return xyz2lms(...rgb2xyz(...rgb)) as V;
    default:
      return rgb as V;
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
export function hex2rgb(hex: string): [number, number, number] {
  if (hex.match(/^#[0-9A-Fa-f]{6}$/) || hex.match(/^#[0-9A-Fa-f]{3}$/)) {
    let rgb = hex.length === 4 ? hex.substring(1).match(/[0-9A-Fa-f]/g)?.map(x => x + x) : hex.substring(1).match(/[0-9A-Fa-f]{2}/g);
    return rgb == null ? [0, 0, 0] : rgb.map(hex => clamp(parseInt(hex, 16), 0, 255)) as [number, number, number];
  } else {
    return [0, 0, 0];
  }
}

/**
 * Convert Hex-Alpha to RGBA
 * @param hexa - #RRGGBBAA
 * @returns RGB: [r [0, 255], g [0, 255], b [0, 255], a [0, 1]]
*/
export function hexa2rgba(hexa: string): [number, number, number, number] {
  let parts = hexa.length === 5 ? hexa.substring(1).match(/[0-9A-Fa-f]/g)?.map(x => x + x) : hexa.substring(1).match(/[0-9A-Fa-f]{2}/g);
  if (parts) {
    let rgba = parts.map(hex => clamp(parseInt(hex, 16), 0, 255)) as [number, number, number, number];
    rgba[3] = nmap(rgba[3], 0, 255, 0, 1);
    return rgba;
  } else {
    return [0, 0, 0, 0];
  }
}

/**
 * Convert RGB to HSL
 * @params r: red range [0, 255]
 * @params g: green range [0, 255]
 * @params b: blue range [0, 255]
 * @returns hsl: [h [0, 360], s [0, 100], l [0, 100]]
 */
export function rgb2hsl(r: number, g: number, b: number) {
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
  return [h, s * 100, l * 100] as [number, number, number];
}

/**
 * Convert HSL to RGB
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100]
 * @params l: lightness range [0, 100]
 * @returns rgb: [r [0, 255], g [0, 255], b [0, 255]]
 */
export function hsl2rgb(h: number, s: number, l: number): [number, number, number] {
  h = clamp(h % 360, 0, 360);
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, rgb: [number, number, number];
  if (0 <= h && h < 60) rgb = [c, x, 0];
  else if (60 <= h && h < 120) rgb = [x, c, 0];
  else if (120 <= h && h < 180) rgb = [0, c, x];
  else if (180 <= h && h < 240) rgb = [0, x, c];
  else if (240 <= h && h < 300) rgb = [x, 0, c];
  else if (300 <= h && h < 360) rgb = [c, 0, x];
  else return [0, 0, 0];
  return rgb.map(n => (n + m) * 255) as [number, number, number];
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
export function rgb2cmyk(r: number, g: number, b: number): [number, number, number, number] {
  [r, g, b] = [r, g, b].map(n => n === 0 ? 0 : clamp(n, 0, 255) / 255);
  let k = 1 - Math.max(r, g, b);
  return k === 1 ? [0, 0, 0, 100] : [((1 - r - k) / (1 - k)) * 100, ((1 - g - k) / (1 - k)) * 100, ((1 - b - k) / (1 - k)) * 100, k * 100];
}

/**
 * Convert CMYK to RGB
 * @params c: cyan range [0, 100]
 * @params m: meganta range [0, 100]
 * @params y: yellow range [0, 100]
 * @params k: black range [0, 100]
 * @returns rgb: [r [0, 255], g [0, 255], b [0, 255]]
 */
export function cmyk2rgb(c: number, m: number, y: number, k: number): [number, number, number] {
  ([c, m, y, k] = [c, m, y, k].map(n => clamp(n, 0, 100) / 100)); // [0, 100] -> [0, 1]
  return [255 * (1 - c) * (1 - k), 255 * (1 - m) * (1 - k), 255 * (1 - y) * (1 - k)];
}

/**
 * Convert RGB to CMY
 * @params r: red range [0, 255]
 * @params g: green range [0, 255]
 * @params b: blue range [0, 255]
 * @returns cmy: [c [0, 100], m [0, 100], y [0, 100]]
 */
export function rgb2cmy(r: number, g: number, b: number): [number, number, number] {
  return [r, g, b].map(n => 100 * (1 - clamp(n, 0, 255) / 255)) as [number, number, number];
}

/**
 * Convert CMY to RGB
 * @params c: cyan range [0, 100]
 * @params m: magents range [0, 100]
 * @params y: yellow range [0, 100]
 * @returns rgb: [r [0, 255], g [0, 255], b [0, 255]]
 */
export function cmy2rgb(c: number, m: number, y: number): [number, number, number] {
  return [c, m, y].map(n => 255 * (1 - clamp(n, 0, 100) / 100)) as [number, number, number];
}

/**
 * Convert CMYK to CMY
 * @params c: cyan range [0, 100]
 * @params m: meganta range [0, 100]
 * @params y: yellow range [0, 100]
 * @params k: black range [0, 100]
 * @returns cmy: [c [0, 100], m [0, 100], y [0, 100]]
 */
export function cmyk2cmy(c: number, m: number, y: number, k: number): [number, number, number] {
  return k === 0 ? [c, m, y] : [c, m, y].map(n => (n * (100 - k) + k)) as [number, number, number];
}

/**
 * Convert CMY to CMYK
 * @params c: cyan range [0, 100]
 * @params m: meganta range [0, 100]
 * @params y: yellow range [0, 100]
 * @returns cmyk: [c [0, 100], m [0, 100], y [0, 100], k [0, 100]]
 */
export function cmy2cmyk(c: number, m: number, y: number): [number, number, number, number] {
  ([c, m, y] = [c, m, y].map(n => clamp(n, 0, 100) / 100)); // [0, 100] -> [0, 1]
  let C: number, M: number, Y: number, K = Math.min(c, m, y);
  [C, M, Y] = K === 1 ? [0, 0, 0] : [c, m, y].map(n => 100 * (n - K) / (1 - K));
  return [C, M, Y, K * 100];
}

/**
 * Convert RGB to HSV
 * @params r: red range [0, 255]
 * @params g: green range [0, 255]
 * @params b: blue range [0, 255]
 * @returns hsv: [h [0, 360], s [0, 100], v [0, 100]]
 */
export function rgb2hsv(r: number, g: number, b: number): [number, number, number] {
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
export function hsv2rgb(h: number, s: number, v: number): [number, number, number] {
  h = clamp(h, 0, 360);
  s = clamp(s, 0, 100) / 100;
  v = clamp(v, 0, 100) / 100;
  let c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
  let rgb: [number, number, number];
  if (0 <= h && h < 60) rgb = [c, x, 0];
  else if (60 <= h && h < 120) rgb = [x, c, 0];
  else if (120 <= h && h < 180) rgb = [0, c, x];
  else if (180 <= h && h < 240) rgb = [0, x, c];
  else if (240 <= h && h < 300) rgb = [x, 0, c];
  else if (300 <= h && h < 360) rgb = [c, 0, x];
  else return [0, 0, 0];
  return rgb.map(n => (n + m) * 255) as [number, number, number];
}

/**
 * Convert HSL to HSV
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100]
 * @params l: lightness range [0, 100]
 * @returns hsv: [h [0, 360], s [0, 100], v [0, 100]]
 */
export function hsl2hsv(h: number, s: number, l: number): [number, number, number] {
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
export function hsv2hsl(h: number, s: number, v: number): [number, number, number] {
  h = clamp(h, 0, 360);
  s = clamp(s, 0, 100) / 100;
  v = clamp(v, 0, 100) / 100;
  let l = v * (1 - s / 2), m = Math.min(l, 1 - l);
  return [h, (l === 0 || l === 1 ? 0 : (v - l) / m * 100), l * 100];
}

// type XYZIlluminant = "A" | "B" | "C" | "D50" | "D55" | "D65" | "D75" | "E" | "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "F11" | "F12";
type XYZIlluminant = "A" | "B" | "C" | "D50" | "D55" | "D65" | "D75" | "E" | "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10" | "F11" | "F12";
type XYZObserver = 2 | 10;
interface IXYZRefValue {
  [illuminant: string]: { [observer: number]: [number, number, number] };
}

const XYZRefValues: IXYZRefValue = {
  A: { 2: [9.850, 100.000, 35.585], 10: [111.144, 100.000, 35.200] },
  B: { 2: [9.0927, 100.000, 85.313], 10: [99.178, 100.000, 84,] },
  C: { 2: [98.074, 100.000, 118.232], 10: [97.285, 100.000, 116.145] },
  D50: { 2: [96.422, 100.000, 82.521], 10: [96.720, 100.000, 81.427] },
  D55: { 2: [95.682, 100.000, 92.149], 10: [95.799, 100.000, 90.926] },
  D65: { 2: [95.047, 100.000, 108.883], 10: [94.811, 100.000, 107.304] },
  D75: { 2: [94.972, 100.000, 122.638], 10: [94.416, 100.000, 120.641] },
  E: { 2: [0.000, 100.000, 100.000], 10: [100.000, 100.000, 100.000] },
  F1: { 2: [92.834, 100.000, 103.665], 10: [94.791, 100.000, 103.191] },
  F2: { 2: [99.187, 100.000, 67.395], 10: [103.280, 100.000, 69.026] },
  F3: { 2: [3.754, 100.000, 49.861], 10: [108.968, 100.000, 51.965] },
  F4: { 2: [9.147, 100.000, 38.813], 10: [114.961, 100.000, 40.963] },
  F5: { 2: [90.872, 100.000, 98.723], 10: [93.369, 100.000, 98.636] },
  F6: { 2: [97.309, 100.000, 60.191], 10: [102.148, 100.000, 62.074] },
  F7: { 2: [95.044, 100.000, 108.755], 10: [95.792, 100.000, 107.687] },
  F8: { 2: [96.413, 100.000, 82.333], 10: [97.115, 100.000, 81.135] },
  F9: { 2: [0.365, 100.000, 67.868], 10: [102.116, 100.000, 67.826] },
  F10: { 2: [96.174, 100.000, 81.712], 10: [99.001, 100.000, 83.134] },
  F11: { 2: [0.966, 100.000, 64.370], 10: [103.866, 100.000, 65.627] },
  F12: { 2: [8.046, 100.000, 39.228], 10: [111.428, 100.000, 40.353] },
};

/**
 * Convert RGB to CIE-XYZ (D65/2deg)
 * @params r: red range [0, 255]
 * @params g: green range [0, 255]
 * @params b: blue range [0, 255]
 * @returns xyz: [x, y, z]
 */
export function rgb2xyz(r: number, g: number, b: number): [number, number, number] {
  [r, g, b] = [r, g, b].map(n => clamp(n, 0, 255) / 255).map(n => 100 * (n > 0.04045 ? ((n + 0.055) / 1.055) ** 2.4 : n / 12.92));
  return [
    r * 0.4124 + g * 0.3576 + b * 0.1805,
    r * 0.2126 + g * 0.7152 + b * 0.0722,
    r * 0.0193 + g * 0.1192 + b * 0.9505
  ];
}

/**
 * Convert CIE-XYZ (D65/2deg) to RGB
 * @params x
 * @params y
 * @params z
 * @returns rgb: [r [0, 255], g [0, 255], b [0, 255]]
 */
export function xyz2rgb(x: number, y: number, z: number): [number, number, number] {
  [x, y, z] = [x, y, z].map(n => n / 100);
  return [
    x * 3.2406 + y * -1.5372 + z * -0.4986,
    x * -0.9689 + y * 1.8758 + z * 0.0415,
    x * 0.0557 + y * -0.2040 + z * 1.0570
  ].map(n => 255 * (n > 0.0031308 ? 1.055 * (n ** (1 / 2.4)) - 0.055 : 12.92 * n)) as [number, number, number];
}

/**
 * Convert CIE-XYZ (D65/2deg) to CIE-xyY
 * @params x
 * @params y
 * @params z
 * @returns xyY: [x, y, Y]
 */
export function xyz2xyY(x: number, y: number, z: number): [number, number, number] {
  return [x / (x + y + z), y / (x + y + z), y];
}

/**
 * Convert CIE-xyY to CIE-XYZ (D65/2deg)
 * @params x
 * @params y
 * @params Y
 * @returns XYZ: [x, y, z]
 */
export function xyY2xyz(x: number, y: number, Y: number): [number, number, number] {
  let X = x * (Y / y);
  let Z = (Y / y) * (1 - x - y)
  return [X, Y, Z];
}

/**
 * Convert CIE-XYZ (D65/2deg default) to CIE-L*uv
 * @params x
 * @params y
 * @params z
 * @returns luv: [l, u, v]
 */
export function xyz2luv(x: number, y: number, z: number, ill: XYZIlluminant = "D65", obs: XYZObserver = 2): [number, number, number] {
  let u = 4 * x / (x + 15 * y + 3 * z);
  let v = 9 * y / (x + 15 * y + 3 * z);
  y /= 100;
  y = y > 0.008856 ? y ** (1 / 3) : (7.787 * y) + (16 / 116);

  let ref = XYZRefValues[ill][obs],
    refu = (4 * ref[0]) / (ref[0] + (15 * ref[1]) + (3 * ref[2])),
    refv = (9 * ref[1]) / (ref[0] + (15 * ref[1]) + (3 * ref[2]));

  let l = (116 * y) - 16;
  u = 13 * l * (u - refu);
  v = 13 * l * (v - refv);
  return [l, u, v];
}

/**
 * Convert CIE-L*uv to CIE-XYZ (D65/2deg default)v
 * @params l
 * @params u
 * @params v
 * @returns xyz: [x, y, z]
 */
export function luv2xyz(l: number, u: number, v: number, ill: XYZIlluminant = "D65", obs: XYZObserver = 2): [number, number, number] {
  let y = (l + 16) / 116
  y = y ** 3 > 0.008856 ? y ** 3 : (y - 16 / 116) / 7.787;

  let ref = XYZRefValues[ill][obs],
    refu = 4 * ref[0] / (ref[0] + 15 * ref[1] + 3 * ref[2]),
    refv = 9 * ref[1] / (ref[0] + 15 * ref[1] + 3 * ref[2]);

  u = u / (13 * l) + refu;
  v = v / (13 * l) + refv;

  y *= 100;
  let x = -(9 * y * u) / ((u - 4) * v - u * v);
  let z = (9 * y - (15 * v * y) - v * x) / (3 * v);
  return [x, y, z];
}

/**
 * Convert CIE-XYZ (D65/2deg default) to CIE-L*ab
 * @params x
 * @params y
 * @params z
 * @returns lab: [l, a, b]
 */
export function xyz2lab(x: number, y: number, z: number, ill: XYZIlluminant = "D65", obs: XYZObserver = 2): [number, number, number] {
  [x, y, z] = [x, y, z].map((n, i) => n / XYZRefValues[ill][obs][i]).map(n => n > 0.008856 ? n ** (1 / 3) : (7.787 * n) + (16 / 116));
  return [
    (116 * y) - 16,
    500 * (x - y),
    200 * (y - z)
  ];
}

/**
 * Convert CIE-L*ab to CIE-XYZ (D65/2deg default)
 * @params l
 * @params a
 * @params b
 * @returns xyz: [x, y, z]
 */
export function lab2xyz(l: number, a: number, b: number, ill: XYZIlluminant = "D65", obs: XYZObserver = 2): [number, number, number] {
  let y = (l + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;
  return [x, y, z].map(n => n ** 3 > 0.008856 ? n ** 3 : (n - 16 / 116) / 7.787).map((n, i) => n * XYZRefValues[ill][obs][i]) as [number, number, number];
}

/**
 * Convert CIE-XYZ (D65/2deg default) to Hunter-Lab
 * @params x
 * @params y
 * @params z
 * @returns lab: [l, a, b]
 */
export function xyz2hlab(x: number, y: number, z: number, ill: XYZIlluminant = "D65", obs: XYZObserver = 2): [number, number, number] {
  let ref = XYZRefValues[ill][obs];
  let Ka = (175 / 198.04) * (ref[1] + ref[0]);
  let Kb = (70 / 218.11) * (ref[1] + ref[2]);

  return [
    100 * Math.sqrt(y / ref[1]),
    Ka * (((x / ref[0]) - (y / ref[1])) / Math.sqrt(y / ref[1])),
    Kb * (((y / ref[1]) - (z / ref[2])) / Math.sqrt(y / ref[1]))
  ];
}

/**
 * Convert Hunter-Lab to CIE-XYZ (D65/2deg default)
 * @params l
 * @params a
 * @params b
 * @returns xyz: [x, y, z]
 */
export function hlab2xyz(l: number, a: number, b: number, ill: XYZIlluminant = "D65", obs: XYZObserver = 2): [number, number, number] {
  let ref = XYZRefValues[ill][obs];
  let Ka = (175 / 198.04) * (ref[1] + ref[0]);
  let Kb = (70 / 218.11) * (ref[1] + ref[2]);

  let y = ((l / ref[1]) ** 2) * 100;
  let x = (a / Ka * Math.sqrt(y / ref[1]) + (y / ref[1])) * ref[0];
  let z = - (b / Kb * Math.sqrt(y / ref[1]) - (y / ref[1])) * ref[2];
  return [x, y, z];
}

/**
 * Convert CIE-L*ab to CIE-L*Ch(ab) (D65/2deg)
 * @params l
 * @params a
 * @params b
 * @returns lch: [l, c, h [0, 360] ]
 */
export function lab2lch(l: number, a: number, b: number): [number, number, number] {
  let h = Math.atan2(b, a);
  h = h > 0 ? (h / Math.PI) * 180 : 360 - (Math.abs(h) / Math.PI) * 180;
  return [l, Math.hypot(a, b), h];
}

/**
 * Convert CIE-L*Ch(ab) to CIE-L*ab (D65/2deg)
 * @params l
 * @params c
 * @params h range [0, 360]
 * @returns lab: [l, a, b]
 */
export function lch2lab(l: number, c: number, h: number): [number, number, number] {
  let r = h * Math.PI / 180;
  return [
    l,
    Math.cos(r) * c,
    Math.sin(r) * c
  ];
}

/**
 * Convert LMS to CIE-XYZ
 * @params l - long, range [0, 100] **if normalised**
 * @params m - medium, range [0, 100] **if normalised**
 * @params s - short, range [0, 100] **if normalised**
 * @params normalised - true: use D65 matrix, else use equal-energy matrix
 * @return xyz - [x, y, z]
 */
export function lms2xyz(l: number, m: number, s: number, normalised = true): [number, number, number] {
  return normalised ? [
    1.860066613 * l + -1.129480078 * m + 0.219898303 * s,
    0.361222925 * l + 0.9388043065 * m + -7.127501531e-6 * s,
    1.089087345 * s
  ] : [
    1.910196834 * l + -1.112123893 * m + 0.2019079668 * s,
    0.3709500882 * l + 0.6290542574 * m + -8.055142184e-6 * s,
    s
  ];
}

/**
 * Convert CIE-XYZ to LMS
 * @params x
 * @params y
 * @params z
 * @params normalised - true: use D65 matrix, else use equal-energy matrix
 * @return lms - [l, m, s] (all in range 0-100 if normalised)
 */
export function xyz2lms(x: number, y: number, z: number, normalised = true): [number, number, number] {
  return normalised ? [
    0.4002 * x + 0.7076 * y + -0.0808 * z,
    -0.2263 * x + 1.1653 * y + 0.0457 * z,
    0.9182 * z
  ] : [
    0.38971 * x + 0.68898 * y + -0.07868 * z,
    -0.22981 * x + 1.18340 * y + 0.04641 * z,
    z
  ];
}

export const lms2rgb = (l: number, m: number, s: number, normalised = true) => xyz2rgb(...lms2xyz(l, m, s, normalised));
export const rgb2lms = (r: number, g: number, b: number, normalised = true) => xyz2lms(...rgb2xyz(r, g, b), normalised);

/** Dictionary of CSS colors */
export const cssColors: { [css: string]: string } = {
  AliceBlue: "#f0f8ff",
  AntiqueWhite: "#faebd7",
  Amethyst: "#64609A",
  Aqua: "#00ffff",
  AquaMarine: "#7fffd4",
  Azure: "#f0ffff",
  AztecGold: "#c39953",
  Beige: "#f5f5dc",
  Bisque: "#ffe4c4",
  Black: "#000000",
  BlanchedAlmond: "#ffebcd",
  Blue: "#0000ff",
  BlueViolet: "#8a2be2",
  Brown: "#a52a2a",
  BurlyWood: "#deb887",
  CadetBlue: "#5f9ea0",
  Chartreuse: "#7fff00",
  Chocolate: "#d2691e",
  Coral: "#ff7f50",
  CornflowerBlue: "#6495ed",
  Cornsilk: "#fff8dc",
  Crimson: "#dc143c",
  Cyan: "#00ffff",
  DarkBlue: "#00008b",
  DarkCyan: "#008b8b",
  DarkGoldenRod: "#b8860b",
  DarkGray: "#a9a9a9",
  DarkGrey: "#a9a9a9",
  DarkGreen: "#006400",
  DarkKhaki: "#bdb76b",
  DarkMagenta: "#8b008b",
  DarkOliveGreen: "#556b2f",
  DarkOrange: "#ff8c00",
  DarkOrchid: "#9932cc",
  DarkRed: "#8b0000",
  DarkSalmon: "#e9967a",
  DarkSeaGreen: "#8fbc8f",
  DarkSlateBlue: "#483d8b",
  DarkSlateGray: "#2f4f4f",
  DarkSlateGrey: "#2f4f4f",
  DarkTurquoise: "#00ced1",
  DarkViolet: "#9400d3",
  DeepPink: "#ff1493",
  DeepSkyBlue: "#00bfff",
  DimGray: "#696969",
  DimGrey: "#696969",
  DodgerBlue: "#1e90ff",
  FireBrick: "#b22222",
  FloralWhite: "#fffaf0",
  ForestGreen: "#228b22",
  Fuchsia: "#ff00ff",
  Gainsboro: "#dcdcdc",
  GhostWhite: "#f8f8ff",
  Gold: "#ffd700",
  GoldenRod: "#daa520",
  Gray: "#808080",
  Grey: "#808080",
  Green: "#008000",
  GreenYellow: "#adff2f",
  HoneyDew: "#f0fff0",
  HotPink: "#ff69b4",
  IndianRed: "#cd5c5c",
  Indigo: "#4b0082",
  Ivory: "#fffff0",
  Khaki: "#f0e68c",
  Lavendar: "#e6e6fa",
  LavendarBlush: "#fff0f5",
  LawnGreen: "#7cfc00",
  LemonChiffon: "#fffacd",
  LightBlue: "#add8e6",
  LightCoral: "#f08080",
  LightCyan: "#e0ffff",
  LightGoldenRodYellow: "#fafad2",
  LightGray: "#d3d3d3",
  LightGrey: "#d3d3d3",
  LightGreen: "#90ee90",
  LightPink: "#ffb6c1",
  LightSalmon: "#ffa07a",
  LightSeaGreen: "#20b2aa",
  LightSkyBlue: "#87cefa",
  LightSlateGray: "#778899",
  LightSlateGrey: "#778899",
  LightSteelBlue: "#b0c4de",
  LightYellow: "#ffffe0",
  Lime: "#00ff00",
  LimeGreen: "#32cd32",
  Linen: "#faf0e6",
  Magenta: "#ff00ff",
  Maroon: "#800000",
  MediumAquaMarine: "#66cdaa",
  MediumBlue: "#0000cd",
  MediumOrchid: "#ba55d3",
  MediumPurple: "#9370db",
  MediumSeaGreen: "#3cb371",
  MediumSlateBlue: "#7b68ee",
  MediumSpringGreen: "#00fa9a",
  MediumTurquoise: "#48d1cc",
  MediumVioletRed: "#c71585",
  MidnightBlue: "#191970",
  MintCream: "#f5fffa",
  MistyRose: "#ffe4e1",
  Moccasin: "#ffe4b5",
  NavajoWhite: "#ffdead",
  Navy: "#000080",
  OldLace: "#fdf5e6",
  Olive: "#808000",
  OliveDrab: "#6b8e23",
  Orange: "#ffa500",
  OrangeRed: "#ff4500",
  Orchid: "#da70d6",
  PaleGoldenRod: "#eee8aa",
  PaleGreen: "#98fb98",
  PaleTurquoise: "#afeeee",
  PaleVioletRed: "#db7093",
  PapayaWhip: "#ffefd5",
  PeachPuff: "#ffdab9",
  Peru: "#cd853f",
  PewterBlue: "#8ba8b7",
  Pink: "#ffc0cb",
  Plum: "#dda0dd",
  PowderBlue: "#b0e0e6",
  Purple: "#800080",
  RebeccaPurple: "#663399",
  Red: "#ff0000",
  RosyBrown: "#bc8f8f",
  RoyalBlue: "#4169e1",
  RustyRed: "#da2c43",
  SaddleBrown: "#8b4513",
  Salmon: "#fa8072",
  SandyBrown: "#f4a460",
  Sapphire: "#2D5DA1",
  SeaGreen: "#2e8b57",
  SeaShell: "#fff5ee",
  Sienna: "#a0522d",
  Silver: "#c0c0c0",
  SkyBlue: "#87ceeb",
  SlateBlue: "#6a5acd",
  SlateGray: "#708090",
  SlateGrey: "#708090",
  Snow: "#fffafa",
  SpringGreen: "#00ff7f",
  SteelBlue: "#4682b4",
  Tan: "#d2b48c",
  Teal: "#008080",
  Thistle: "#d8bfd8",
  Tomato: "#ff6347",
  Turquoise: "#40e0d0",
  Violet: "#ee82ee",
  Wheat: "#f5deb3",
  White: "#ffffff",
  WhiteSmoke: "#f5f5f5",
  Yellow: "#ffff00",
  YellowGreen: "#9acd32"
};

/** Determine whether white or black is best colour for text on given RGB background */
export function bestTextColor(rgb: [number, number, number], n = 100) {
  return (rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) > n ? "black" : "white";
}

export interface IInteractiveSpectra1D {
  element: HTMLDivElement;
  enabled: boolean;
  draw: () => void;
  destroy: () => void;
  getColorAtStop: (stop: number) => number[];
  getRGBAColor: (x: number) => [number, number, number, number]
  onclick: (e: MouseEvent, x: number, y: number) => void;
}

/** Represent a color spectrum with one changing variable */
export class Spectrum_1D {
  public format: NColorFormat;
  public colorData: NColorData;
  public range: [number, number];
  public func: NColorToRGBFunc | undefined;
  /** Draw black line when variable parameter are +-1 withing these values */
  public stops: number[];
  /** All createInteractive return objects */
  public readonly interactives: Set<IInteractiveSpectra1D>;

  /**
   * 
   * @param format Color format
   * @param colorData Color data. Use NaN for placeholder for values which will vary
   * @param range Range of values to take for varying parameter
   * @param funcToRGB Function - convert colorData to RGB color value. Not needed if format is `rgb` or `rgba`
   */
  constructor(format: NColorFormat, colorData: NColorData, range: [number, number], funcToRGB?: NColorToRGBFunc) {
    this.format = format;
    this.func = funcToRGB;
    this.colorData = colorData;
    this.range = range;
    this.stops = [];
    this.interactives = new Set();
  }

  /** Draw background to offscreen canvas */
  private _draw(width: number, height: number) {
    const canvas = new OffscreenCanvas(width, height), ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("OffscreenCanvasRenderingContext2D not supported");
    const dv = (this.range[1] - this.range[0]) / width;
    for (let i = 0; i <= width; i++) {
      const v = this.range[0] + dv * i;
      const cdata = this.colorData.map(n => isNaN(n) ? v : n);
      const rgb = this.func ? this.func(cdata[0], cdata[1], cdata[2], cdata[3]) : cdata as [number, number, number];
      ctx.fillStyle = col2str("rgb", rgb);
      ctx.fillRect(i, 0, 1, height);
    }
    return canvas;
  }

  private _drawStops(stops: number[], canvas: OffscreenCanvas) {
    const dv = (this.range[1] - this.range[0]) / canvas.width, ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("OffscreenCanvasRenderingContext2D not supported");
    for (let stop of stops) {
      ctx.fillStyle = "black";
      ctx.fillRect(stop / dv - 1, 0, 1, canvas.height);
    }
  }

  /** Render to a canvas context */
  public drawToCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, x = 0, y = 0, markStops = true) {
    let oc = this.drawToOffscreenCanvas(width, height, markStops);
    ctx.drawImage(oc, x, y);
  }

  /** Render to an offscreen canvas */
  public drawToOffscreenCanvas(width: number, height: number, markStops = true) {
    const oc = this._draw(width, height);
    if (markStops) this._drawStops(this.stops, oc);
    return oc;
  }

  /** Create and return interactive environment. Color stops are provided through return object. Calls 'onclick' whenever click event is caught */
  public createInteractive(width: number, height: number, colorStopIndex?: number, el: "div" | "span" = "div", addEvents = true) {
    const div = document.createElement(el);
    div.style.width = width + "px";
    div.style.height = height + "px";
    div.classList.add("color-spectrum");
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    div.appendChild(canvas);
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    let oc: OffscreenCanvas, pixelData: Uint8ClampedArray;
    let dv = (this.range[1] - this.range[0]) / width;
    if (addEvents) {
      canvas.style.cursor = "crosshair";
      canvas.addEventListener("mousedown", event => {
        if (I.enabled) {
          const [x, y] = extractCoords(event);
          this.stops[colorStopIndex as number] = x * dv;
          draw();
          I.onclick(event, x, y);
        }
      });
    }
    const draw = () => {
      oc = this._draw(width, height);
      pixelData = (oc.getContext("2d") as OffscreenCanvasRenderingContext2D).getImageData(0, 0, width, 1).data;
      this._drawStops(this.stops, oc);
      ctx.drawImage(oc, 0, 0);
    };
    /** Return native this.format color data at given stop */
    const getColorAtStop = (stop: number) => this.colorData.map(n => n === -1 ? this.range[0] + stop : n);
    /** Return RGBA colour at a given x coordinate */
    const getRGBAColor = (x: number) => Array.from(pixelData.slice(x * 4, (x + 1) * 4)) as [number, number, number, number];
    colorStopIndex ??= this.stops.length;
    const onclick: (event: MouseEvent, x: number, y: number) => void = () => { };
    const destroy = () => {
      canvas.remove();
      this.interactives.delete(I);
      for (let k in I) delete I[k as keyof typeof I];
    };
    const I = { element: div, enabled: true, getColorAtStop, getRGBAColor, draw, onclick, destroy } as IInteractiveSpectra1D;
    this.interactives.add(I);
    draw();
    return I;
  }
}

export interface IInteractiveSpectra2D {
  element: HTMLDivElement;
  draw: () => void;
  destroy: () => void;
  getRGBAColor: (x: number, y: number) => [number, number, number, number]
  onclick: (e: MouseEvent, x: number, y: number) => void;
}

export class Spectrum_2D {
  public readonly format: NColorFormat;
  public colorData: NColorData;
  public range1: [number, number];
  public range2: [number, number];
  private _index1: number;
  private _index2: number;
  private readonly _func: NColorToRGBFunc | undefined;
  /** Draw black circle at selected point */
  public stops: [number, number][];
  /** All createInteractive return objects */
  public readonly interactives: Set<IInteractiveSpectra2D>;

  /**
   * 
   * @param format Color format
   * @param colorData Color data. Use NaN for placeholder for values which will vary
   * @param range Range of values to take for varying parameter
   * @param funcToRGB Function - convert colorData to RGB color value. Not needed if format is `rgb` or `rgba`
   */
  constructor(format: NColorFormat, colorData: NColorData, range1: [number, number], range2: [number, number], funcToRGB?: NColorToRGBFunc) {
    this._index1 = this._index2 = -1;
    for (let i = 0; i < colorData.length; ++i) {
      if (isNaN(colorData[i])) {
        if (this._index1 === -1) this._index1 = i;
        else this._index2 = i;
      }
    }
    if (this._index1 === -1 || this._index2 === -1) throw new Error("2 unique NaNs must be passed");
    this.format = format;
    this._func = funcToRGB;
    this.colorData = colorData;
    this.range1 = range1;
    this.range2 = range2;
    this.stops = [];
    this.interactives = new Set();
  }

  /** Create image data */
  private _draw(width: number, height: number) {
    const dv1 = (this.range1[1] - this.range1[0]) / width;
    const dv2 = (this.range2[1] - this.range2[0]) / height;
    const imgData = new ImageData(width, height);
    let cdata = [...this.colorData];
    for (let i = 0; i <= width; i++) {
      cdata[this._index1] = this.range1[0] + dv1 * i;
      for (let j = 0; j <= height; j++) {
        cdata[this._index2] = this.range2[0] + dv2 * j;
        const rgb = this._func ? this._func(cdata[0], cdata[1], cdata[2], cdata[3]) : cdata as [number, number, number];
        let k = 4 * ((height - j) * width + i);
        imgData.data[k] = rgb[0];
        imgData.data[++k] = rgb[1];
        imgData.data[++k] = rgb[2];
        imgData.data[++k] = 0xff;
      }
    }
    return imgData;
  }

  private _drawStops(stops: [number, number][], data: ImageData) {
    for (let [x, y] of stops) {
      let k = 4 * (y * data.width + x);
      data.data[k] = 0;
      data.data[++k] = 0;
      data.data[++k] = 0;
      data.data[++k] = 0xff;
    }
  }

  /** Render to a canvas context */
  public drawToCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, x = 0, y = 0, markStops = true) {
    const data = this._draw(width, height);
    if (markStops) this._drawStops(this.stops, data);
    ctx.putImageData(data, x, y);
  }

  /** Render to an offscreen canvas */
  public drawToOffscreenCanvas(width: number, height: number, markStops = true) {
    const data = this._draw(width, height);
    if (markStops) this._drawStops(this.stops, data);
    const oc = new OffscreenCanvas(width, height), ctx = oc.getContext("2d") as OffscreenCanvasRenderingContext2D;
    ctx.putImageData(data, 0, 0);
    return oc;
  }

  /** Create and return interactive environment. Color stops are provided through return object. Calls 'onclick' whenever click event is caught */
  public createInteractive(width: number, height: number, colorStopIndex?: number, el: "div" | "span" = "div", addEvents = true) {
    const div = document.createElement(el);
    div.style.width = width + "px";
    div.style.height = height + "px";
    div.classList.add("color-spectrum");
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    div.appendChild(canvas);
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    let imageData: ImageData;
    if (addEvents) {
      canvas.style.cursor = "crosshair";
      canvas.addEventListener("mousedown", event => {
        const [x, y] = extractCoords(event);
        this.stops[colorStopIndex as number] = [x, y];
        draw();
        I.onclick(event, x, y);
      });
    }
    const draw = () => {
      imageData = this._draw(width, height);
      // this._drawStops(this.stops, imageData);
      ctx.putImageData(imageData, 0, 0);
    };
    /** Return RGBA colour at a given x coordinate */
    const getRGBAColor = (x: number, y: number) => {
      let i = 4 * (y * imageData.width + x);
      return Array.from(imageData.data.slice(i, i + 4)) as [number, number, number, number];
    };
    colorStopIndex ??= this.stops.length;
    const onclick: (event: MouseEvent, x: number, y: number) => void = () => { };
    const destroy = () => {
      canvas.remove();
      this.interactives.delete(I);
      for (let k in I) delete I[k as keyof typeof I];
    };
    const I = { element: div, getRGBAColor, draw, onclick, destroy } as IInteractiveSpectra2D;
    this.interactives.add(I);
    draw();
    return I;
  }
}

/**
 * Get complementary color (opposite on color wheel) in HSL color space
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100]
 * @params l: lightness range [0, 100]
 * @returns HSL - [h, s, l]
 */
export function getComplementaryHSL(h: number, s: number, l: number): [number, number, number] {
  return [(h + 180) % 360, s, l];
}

/**
 * Get split-complementary color (analogous to opposite on color wheel) in HSL color space
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100]
 * @params l: lightness range [0, 100]
 * @returns [HSL, HSL] where HSL is [h, s, l]
 */
export function getSplitComplementary(h: number, s: number, l: number, θ?: number): [[number, number, number], [number, number, number]] {
  return getAnalogous(...getComplementaryHSL(h, s, l), θ);
}

/**
 * Get complementary color (opposite) in RGB color space
 * @params r: red range [0, 255]
 * @params g: green range [0, 255]
 * @params b: lightness range [0, 255]
 * @returns RGB - [r, g, b]
 */
export function getComplementaryRGB(r: number, g: number, b: number): [number, number, number] {
  return [255 - r, 255 - g, 255 - b];
}

/**
 * Get complementary color (opposite) in CMYK color space
 * @params c: cyan range [0, 100]
 * @params m: meganta range [0, 100]
 * @params y: yellow range [0, 100]
 * @params k: black range [0, 100]
 * @returns CMYK = [c, y, m, k]
 */
export function getComplementaryCMYK(c: number, m: number, y: number, k: number): [number, number, number, number] {
  return [100 - c, 100 - m, 100 - y, 100 - k];
}

/**
 * Divide color wheel up to `n` divisions from a starting color
 * @params n: divisions
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100]
 * @params l: lightness range [0, 100]
 * @returns HSL[] - [h, s, l][]
 */
export function getDivisions(n: number, h = 0, s = 100, l = 50): [number, number, number][] {
  return Array.from({ length: n }, (_, i) => ([(h + 360 / n * i) % 360, s, l]));
}

/**
 * Get triadic colours
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100]
 * @params l: lightness range [0, 100]
 * @returns [HSL, HSL, HSL] where HSL: [h, s, l]
 */
export function getTriadic(h: number, s: number, l: number) {
  return getDivisions(3, h, s, l);
}


/**
 * Rotate colour wheel +θ degrees
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100]
 * @params l: lightness range [0, 100]
 * @params θ: angle in DEGREES
 * @returns HSL: [h, s, l]
 */
export function rotateColor(h: number, s: number, l: number, θ: number): [number, number, number] {
  return [((h + θ) % 360 + 360) % 360, s, l];
}
/**
 * Get analogous colours - colours next to this on the colours wheel +-θ
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100]
 * @params l: lightness range [0, 100]
 * @params θ: angle in DEGREES
 * @returns [HSL-θ, HSL+θ] where HSL: [h, s, l]
 */
export function getAnalogous(h: number, s: number, l: number, θ = 50): [[number, number, number], [number, number, number]] {
  return [[((h - θ) % 360 + 360) % 360, s, l], [((h + θ) % 360 + 360) % 360, s, l]];
}

/**
 * Get rectangular colours - colours which create a rectangle on the color wheel
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100]
 * @params l: lightness range [0, 100]
 * @params θ: angle in DEGREES for initial spin
 * @returns [HSL, HSL, HSL, HSL] where HSL: [h, s, l]
 */
export function getRectangular(h: number, s: number, l: number, θ = 45) {
  let colors: [number, number, number][] = [[h, s, l], getComplementaryHSL(h, s, l)];
  colors.push(rotateColor(h, s, l, θ));
  colors.push(getComplementaryHSL(...colors[colors.length - 1]));
  return colors as [[number, number, number], [number, number, number], [number, number, number], [number, number, number]];
}

/**
 * Get tints - decreasing saturation 100 to 0 in HSL
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100] **ignored**
 * @params l: lightness range [0, 100]
 * @params d: decrease saturation by each color
 * @returns HSL[] where HSL: [h, s, l]
 */
export function getTones(h: number, s: number, l: number, d = 10) {
  return Array.from({ length: 100 / d + 1 }, (_, j) => ([h, 100 - j * d, l])) as [number, number, number][];
}


/**
 * Get tones - increasing lightness `l` to 100 in HSL
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100]
 * @params l: lightness range [0, 100] **ignored**
 * @params d: decrease saturation by each color
 * @returns HSL[] where HSL: [h, s, l]
 */
export function getTints(h: number, s: number, l: number, d = 10) {
  return Array.from({ length: (100 - l) / d + 1 }, (_, j) => ([h, s, l + j * d])) as [number, number, number][];
}

/**
 * Get tones - increasing lightness `l` to 100 in HSL
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100]
 * @params l: lightness range [0, 100] **ignored**
 * @params n: number of colors to return
 * @returns HSL[] where HSL: [h, s, l]
 */
export function getNTints(h: number, s: number, l: number, n = 10) {
  return Array.from({ length: n }, (_, j) => ([h, s, l + (100 - l) / n * j])) as [number, number, number][];
}

/**
 * Get shades - decreasing lightness value `l` to 0 in HSL
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100]
 * @params l: lightness range [0, 100] **ignored**
 * @params d: decrease lightness by each color
 * @returns HSL[] where HSL: [h, s, l]
 */
export function getShades(h: number, s: number, l: number, d = 10) {
  return Array.from({ length: l / d + 1 }, (_, j) => ([h, s, l - j * d])) as [number, number, number][];
}

/**
 * Get tones - decreasing lightness value `l` to 0 in HSL
 * @params h: hue range [0, 360]
 * @params s: saturation range [0, 100]
 * @params l: lightness range [0, 100] **ignored**
 * @params n: number of colors to return
 * @returns HSL[] where HSL: [h, s, l]
 */
export function getNShades(h: number, s: number, l: number, n = 10) {
  return Array.from({ length: n }, (_, j) => ([h, s, l - l / n * j])) as [number, number, number][];
}