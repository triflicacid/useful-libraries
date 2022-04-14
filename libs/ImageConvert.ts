export class ImageConvert {
  public oc: OffscreenCanvas;

  constructor(width: number, height: number) {
    this.oc = new OffscreenCanvas(width, height);
  }

  /** Draw to canvas */
  public drawToCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
    let m = Math.min(width / this.oc.width, height / this.oc.height);
    let x = this.oc.width * m < width ? (width - m * this.oc.width) / 2 : 0;
    let y = this.oc.height * m < height ? (height - m * this.oc.height) / 2 : 0;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.drawImage(this.oc, x, y, this.oc.width * m, this.oc.height * m);
  }

  /** Load image (scale to fit width/height) */
  public loadImage(img: HTMLImageElement) {
    let oc = new OffscreenCanvas(img.width, img.height), occtx = oc.getContext("2d") as OffscreenCanvasRenderingContext2D;
    occtx.drawImage(img, 0, 0);
    let m = Math.min(this.oc.width / img.width, this.oc.height / img.height);
    let x = img.width * m < this.oc.width ? (this.oc.width - m * img.width) / 2 : 0;
    let y = img.height * m < this.oc.height ? (this.oc.height - m * img.height) / 2 : 0;
    let ctx = this.oc.getContext("2d") as OffscreenCanvasRenderingContext2D;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.oc.width, this.oc.height);
    ctx.clearRect(x, y, img.width * m, img.height * m);
    ctx.drawImage(oc, x, y, img.width * m, img.height * m);
  }

  /** Load data url (scale to fit width/height) */
  public async loadURL(dataURL: string) {
    let img = new Image();
    await new Promise(res => {
      img.onload = res;
      img.src = dataURL;
    });
    let oc = new OffscreenCanvas(img.width, img.height), occtx = oc.getContext("2d") as OffscreenCanvasRenderingContext2D;
    occtx.drawImage(img, 0, 0);
    let m = Math.min(this.oc.width / img.width, this.oc.height / img.height);
    let x = img.width * m < this.oc.width ? (this.oc.width - m * img.width) / 2 : 0;
    let y = img.height * m < this.oc.height ? (this.oc.height - m * img.height) / 2 : 0;
    let ctx = this.oc.getContext("2d") as OffscreenCanvasRenderingContext2D;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.oc.width, this.oc.height);
    ctx.clearRect(x, y, img.width * m, img.height * m);
    ctx.drawImage(oc, x, y, img.width * m, img.height * m);
  }

  /** Convert to data url */
  public async toBlob(type: "image/png" | "image/jpeg" | "image/webp" | "image/bmp" = "image/png") {
    if (type === "image/bmp") {
      const buf = (this.oc.getContext("2d") as OffscreenCanvasRenderingContext2D).getImageData(0, 0, this.oc.width, this.oc.height).data;
      const data = arrayBufferToBMPData(buf, this.oc.width, this.oc.height);
      return new Blob([data], { type });
    } else {
      return await this.oc.convertToBlob({ type });
    }
  }

  /** Convert to data url */
  public async toDataURL(type: "image/png" | "image/jpeg" | "image/webp" | "image/bmp" = "image/png") {
    if (type === "image/bmp") {
      const buf = (this.oc.getContext("2d") as OffscreenCanvasRenderingContext2D).getImageData(0, 0, this.oc.width, this.oc.height).data;
      const data = new Uint8Array(arrayBufferToBMPData(buf, this.oc.width, this.oc.height));
      let str = "";
      for (let i = 0; i < data.length; i++) str += String.fromCharCode(data[i]);
      return "data:image/bmp;base64," + str;
    } else {
      return URL.createObjectURL(await this.oc.convertToBlob({ type }));
    }
  }

  /** Create from Image. */
  public static fromImage(img: HTMLImageElement) {
    let K = new ImageConvert(img.width, img.height), ctx = K.oc.getContext("2d") as OffscreenCanvasRenderingContext2D;
    ctx.drawImage(img, 0, 0);
    return K;
  }

  /** Create from data URL */
  public static async fromDataURL(dataURL: string) {
    let img = new Image();
    await new Promise(res => {
      img.onload = res;
      img.src = dataURL;
    });
    return ImageConvert.fromImage(img);
  }
}

/** Extract data url from File */
export async function fileToDataURL(file: File) {
  return await new Promise<string>(res => {
    let reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.readAsDataURL(file as File);
  });
}

/** Extract string from File */
export async function fileToString(file: File) {
  return await new Promise<string>(res => {
    let reader = new FileReader();
    reader.onload = () => res(reader.result as string);
    reader.readAsText(file as File);
  });
}

export function arrayBufferToDataURL(ab: ArrayBuffer) {
  return URL.createObjectURL(new Blob([ab]));
}

export const dataURLToBlob = async (dataURL: string) => await (await fetch(dataURL)).blob();
export const blobToDataURL = (blob: Blob) => URL.createObjectURL(blob);

/** ArrayBuffer image data to BMP file */
export function arrayBufferToBMPData(buf: ArrayBufferLike, width: number, height: number) {
  // !NB modified from canvas-to-bmp version 1.0 ALPHA \n (c) 2015 Ken "Epistemex" Fyrstenberg \n MIT License(this header required)
  const data = new Uint32Array(buf);
  const stride = Math.floor((32 * width + 31) / 32) * 4; // Row length + padding
  const filesize = 122 + stride * height;
  const file = new ArrayBuffer(filesize), view = new DataView(file);
  let pos = 0, x: number, y = 0, p: number, s = 0, a: number, v: number;

  const setU16 = (data: number) => {
    view.setUint16(pos, data, true);
    pos += 2;
  };
  const setU32 = (data: number) => {
    view.setUint32(pos, data, true);
    pos += 4;
  };

  // File Header
  setU16(0x4d42); // Magic bytes for bitmap
  setU32(filesize); // File size
  pos += 4; // - unused -
  setU32(0x7a); // Offset to pixels

  // DIB header
  setU32(108); // header size
  setU32(width); // Row width
  setU32(-height >>> 0); // Negates height
  setU16(1); // 1 plane
  setU16(32); // 32-bits (RGBA)
  setU32(3); // no compression (BI_BITFIELDS, 3)
  setU32(stride * height);  // bitmap size incl. padding (stride x height)
  setU32(2835); // pixels/meter h (~72 DPI x 39.3701 inch/m)
  setU32(2835); // pixels/meter v
  pos += 8; // skip color/important colors
  setU32(0xff0000); // red channel mask
  setU32(0xff00); // green channel mask
  setU32(0xff); // blue channel mask
  setU32(0xff000000); // alpha channel mask
  setU32(0x57696e20); // " win" color space

  // Bitmap data, change order of ABGR to BGRA
  while (y < height) {
    p = 0x7a + y * stride; // offset + stride x height
    x = 0;
    while (x < width * 4) {
      v = data[s++]; // ABRG data
      a = v >>> 24; // Remove alpha channel
      view.setUint32(p + x, (v << 8) | a); // Set BGRA
      x += 4;
    }
    y++
  }

  return data;
}