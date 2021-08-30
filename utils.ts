/** Return a random integer between min (incl.) and max (excl.) */
export const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

/** Return a random item from an array */
export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/** Remove an item from an array */
export function arrayRemove<T>(array: T[], item: T): boolean {
  let i = array.indexOf(item);
  if (i === -1) {
    return false;
  } else {
    array.splice(i, 1);
    return true;
  }
}

/** Peek an array from the back */
export function peek<T>(array: T[], n: number): T {
  return array[array.length - n];
}

/** Get mouse coordinates over an element from an event */
export function extractCoords(event: MouseEvent) {
  const box = (<HTMLElement>event.target).getBoundingClientRect();
  return [event.clientX - box.left, event.clientY - box.top];
}

/** Is the given Number an integer? */
export const isInteger = (n: number) => parseInt(n.toString()) === n;

/** Round a number to a given number of decimal places */
export function round(n: number, dp: number) {
  const x = Math.pow(10, dp);
  return Math.round(n * x) / x;
}

/** Is number in a given range? */
export const inRange = (n: number, min: number, max: number) => n >= min && n < max;

/** Scale a number <n> from range <inMin>-<inMax> to <outMin>-<outMax> presevring propertions */
export const scaleRange = (n: number, inMin: number, inMax: number, outMin: number, outMax: number) => (n - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

/** Linear interpolate dist% between min and max */
export const lerp = (min: number, max: number, dist: number) => min + (max - min) * dist;

/** Capitalise each word in a string */
export const capitalise = (string: string) => string.split(' ').map(s => s[0].toUpperCase() + s.substr(1).toLowerCase()).join(' ');

/** Insert spaces between capital letters e.g. "HelloWorld" --> "Hello World" */
export const spaceBetweenCaps = (str: string): string => str.replace(/(?<=[a-z])(?=[A-Z])/g, ' ');

/** Rotate coordinates around a centre */
export const rotateCoords = (cx: number, cy: number, r: number, theta: number): [number, number] => ([cx + r * Math.cos(theta), cy + r * Math.sin(theta)]);

/** Polar coords to cartesian coords => returns [x, y] */
export const polarToCartesian = (r: number, theta: number) => ([r * Math.cos(theta), r * Math.sin(theta)]);

/** Cartesian coordinates to polar coordinates => returns [radius, theta] */
export const cartesianToPolar = (x: number, y: number) => ([Math.sqrt(x * x + y * y), Math.atan(x / y)]);