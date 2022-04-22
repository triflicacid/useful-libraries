import * as col from "../color";

export interface IColorSeries {
  type: string;
  make: string;
  series: string;
  colors: { name: string; hex: string; }[];
}

/** List of all colors. Initially empty, but may be added to. Type: IColorSeries[] */
export const colorList: IColorSeries[] = [];

/** Transform simple color map { name -> hex } to IColorSeries object */
export function toColorSeries(type: string, make: string, series: string, colors: { [name: string]: string }): IColorSeries {
  return { type, make, series, colors: Object.entries(colors).map(([name, hex]) => ({ name, hex: hex.toUpperCase() })) };
}

/** Return closest colours via HSL */
export function getClosestColor(rgb: [number, number, number], tolerance: [number, number, number] = [15, 50, 50], colors = colorList) {
  tolerance[0] = col.clamp(tolerance[0] % 360, 0, 360);
  const targetHSL = col.rgb2hsl(...rgb);
  const close: IColorSeries[] = [];
  for (const cseries of colors) {
    const repr = { type: cseries.type, make: cseries.make, series: cseries.series, colors: [] } as IColorSeries;
    for (const color of cseries.colors) {
      const hsl = col.rgb2hsl(...col.hex2rgb(color.hex));
      if (targetHSL.every((_, i) => targetHSL[i] - tolerance[i] <= hsl[i] && hsl[i] <= targetHSL[i] + tolerance[i])) {
        repr.colors.push(color);
      }
    }
    if (repr.colors.length > 0) close.push(repr);
  }
  return close;
}