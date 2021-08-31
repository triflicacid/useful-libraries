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

/** Clamp a number within a range */
export const clamp = (min: number, max: number, n: number) => {
  if (n < min) return min;
  if (n > max) return max;
  return n;
};

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

/** Given an object, return new object with [key: value] and [value: key] */
export function createEnum(object: object): object {
  const enumeration = {};
  for (let key in object)
    if (object.hasOwnProperty(key)) {
      enumeration[key] = object[key];
      enumeration[object[key]] = key;
    }
  return enumeration;
};

/** Scroll to bottom of element */
export const scrollToBottom = (el: HTMLElement) => el.scrollTop = el.scrollHeight;

/** Split string into <nSize> groups  */
export const groupString = (string: string, nSize: number): string[] => string.match(new RegExp(`.{1,${nSize}}`, 'g'));

/** Read text from a File object */
export async function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/** Download the given <text> in a file called <fname> */
export function downloadTextFile(text: string, fname: string) {
  let data = new Blob([text], { type: 'text/plain' });
  let url = window.URL.createObjectURL(data);
  downloadLink(url, fname);
}

/** Download the link <href> with name <fname> to client */
export function downloadLink(href: string, fname: string) {
  const a = document.createElement('a');
  a.href = href;
  a.setAttribute('download', fname);
  a.click();
  a.remove();
}

/** Try to remove child from parent, but doesn't throw error on failure. Instead, returns boolean success. */
export function removeChild(parent: HTMLElement, child: HTMLElement): boolean {
  try {
    parent.removeChild(child);
    return true;
  } catch {
    return false;
  }
}

/** Parse a HTML string and return as an element */
export function parseHTML<T = HTMLElement>(html): T {
  const div = document.createElement('div');
  div.insertAdjacentHTML("beforeend", html);
  return div.firstElementChild as any;
}