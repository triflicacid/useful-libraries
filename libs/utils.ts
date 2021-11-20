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

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/** Console colour escape sequences */
export const consoleColours = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
};

/** Decode an escape sequence and return the character and new position */
export function decodeEscapeSequence(string: string, pos: number): { char: string, pos: number } {
  let char: string;
  switch (string[pos]) {
    case 'b': char = String.fromCharCode(0x8); pos++; break; // BACKSPACE
    case 'n': char = String.fromCharCode(0xA); pos++; break; // LINE FEED
    case 'r': char = String.fromCharCode(0xD); pos++; break; // CARRIAGE RETURN
    case 't': char = String.fromCharCode(0x9); pos++; break; // HORIZONTAL TAB
    case 'v': char = String.fromCharCode(0xB); pos++; break; // VERTICAL TAB
    case '0': char = String.fromCharCode(0x0); pos++; break; // NULL
    case 's': char = String.fromCharCode(0x20); pos++; break; // WHITESPACE
    case 'x': { // HEXADECIMAL ESCAPE SEQUENCE
      pos++;
      let nlit = '';
      while (string[pos] && /[0-9A-Fa-f]/.test(string[pos])) {
        nlit += string[pos];
        pos++;
      }
      if (nlit.length === 0) throw new Error(`Invalid hexadecimal escape sequence. Expected hexadecimal character, got '${string[pos]}'`);
      char = String.fromCharCode(parseInt(nlit, 16));
      break;
    }
    case 'o': { // OCTAL ESCAPE SEQUENCE
      pos++;
      let nlit = '';
      while (string[pos] && /[0-7]/.test(string[pos])) {
        nlit += string[pos];
        pos++;
      }
      if (nlit.length === 0) throw new Error(`Invalid octal escape sequence. Expected octal character, got '${string[pos]}'`);
      char = String.fromCharCode(parseInt(nlit, 8));
      break;
    }
    case 'd': { // DECIMAL ESCAPE SEQUENCE
      pos++;
      let nlit = '';
      while (string[pos] && /[0-9]/.test(string[pos])) {
        nlit += string[pos];
        pos++;
      }
      if (nlit.length === 0) throw new Error(`Invalid decimal escape sequence. Expected decimal character, got '${string[pos]}'`);
      char = String.fromCharCode(parseInt(nlit, 10));
      break;
    }
    default:
      char = string[pos++];
  }
  return { char, pos };
}

/** Parse and return extracted string from string[startIndex] to " */
export function parseString(string: string, startIndex: number): { string: string, endIndex: number } {
  let seq = '', j = startIndex + 1;
  while (true) {
    if (string[j] === '"') break;
    if (string[j] === '\\' && string[j + 1]) { // ESCAPE SEQUENCE
      ++j;
      const obj = decodeEscapeSequence(string, j);
      if (obj.char) {
        j = obj.pos;
        seq += obj.char;
        continue;
      }
    }
    if (string[j] === undefined) throw new Error(`Unexpected end of input in string literal at position ${j}`);
    seq += string[j];
    j++;
  }
  return { string: seq, endIndex: j };
}

export interface IParseNumberOptions {
  exponent?: boolean; // Allow exponent ...e
  decimal?: boolean; // Allow decimal
  seperator?: string; // Numeric seperator
  signed?: boolean; // Scan for +/-
}

const radices = { x: 16, d: 10, b: 2, o: 8 };
const radicesRegex = { 16: /[0-9A-Fa-f]/, 10: /[0-9]/, 2: /[01]/, 8: /[0-7]/ };
export function parseNumber(string: string, opts: IParseNumberOptions = {}) {
  opts.exponent ??= true;
  opts.decimal ??= true;
  opts.signed ??= true;

  let pos = 0, sign = 1, strBeforeDot = '', strAfterDot = '', radix = 10, exp = null;
  let metSign = !opts.signed, metDigitBeforeDecimal = false, metDot = false, metDigitAfterDecimal = false, metE = false, metSeperator = false, metRadix = false;

  for (pos = 0; pos < string.length; pos++) {
    if (!metSign && (string[pos] === '-' || string[pos] === '+')) { // Sign
      metSign = true;
      sign = string[pos] === '-' ? -1 : 1;
      metSeperator = false;
    } else if (pos === 0 && string[pos] === '0' && string[pos + 1] in radices) { // Radix
      pos++;
      radix = radices[string[pos]];
    } else if (radicesRegex[radix].test(string[pos])) { // Digit
      metSeperator = false;
      if (!metSign) metSign = true; // Default to '+'
      if (metDot) {
        strAfterDot += string[pos];
        metDigitAfterDecimal = true;
      } else {
        strBeforeDot += string[pos];
        metDigitBeforeDecimal = true;
      }
    } else if (opts.decimal && string[pos] === '.') { // seperator
      if (metSeperator) throw new Error("Invalid syntax: expected digit in number literal");
      if (!metDot) {
        metDot = true;
      } else {
        break; // INVALID
      }
    } else if (string[pos].toLowerCase() === 'e') {
      if (metSeperator) throw new Error("Invalid syntax: expected digit in number literal");
      metSeperator = false;
      if (opts.exponent) {
        const newOpts = { ...opts };
        newOpts.exponent = false;
        const obj = parseNumber(string.substr(pos + 1), newOpts);
        if (obj.str === '') break;
        pos += 1 + obj.pos;
        exp = obj;
        break;
      } else {
        break; // INVALID
      }
    } else if (opts.seperator && string[pos] === opts.seperator) {
      if (metSeperator) {
        throw new Error(`Invalid number literal: unexpected seperator`);
      } else {
        if (metDot && !metDigitAfterDecimal) break;
        if (!metDigitBeforeDecimal) break;
        metSeperator = true;
      }
    } else {
      break; // INVALID
    }
  }

  if (strBeforeDot !== '') strBeforeDot = parseInt(strBeforeDot, radix).toString();
  if (strAfterDot !== '') strAfterDot = parseInt(strAfterDot, radix).toString();
  let str = strBeforeDot + (metDot ? '.' + strAfterDot : '');
  if (str === '.' || str.startsWith('.e')) {
    pos = 0;
    str = '';
  }

  let num = sign * +str, base = num;
  if (exp) {
    num *= Math.pow(10, exp.num);
    str += 'e' + exp.str;
    exp = exp.num;
  }
  return { pos, str: string.substring(0, pos), sign, base, exp, radix, num };
}

/** Parse caracter literal (assume literal is enclosed in '<literal>') */
export function parseCharLit(literal: string): string {
  if (literal[0] === '\\') {
    let obj = decodeEscapeSequence(literal, 1);
    if (obj.pos !== literal.length) throw new Error(`Character literal too large`);
    return obj.char;
  } else {
    if (literal.length !== 1) throw new Error(`Character literal too large`);
    return literal[0];
  }
}