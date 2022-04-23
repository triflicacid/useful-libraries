import * as col from "../libs/color";

function listCssColors() {
  for (let name in col.cssColors) {
    let p = document.createElement("p"), hex = col.cssColors[name], rgb = col.hex2rgb(hex);
    p.insertAdjacentHTML("beforeend", `${name}: `);
    let div = document.createElement("div");
    div.style.display = "inline-block";
    div.style.border = "1px solid black";
    div.style.padding = "4px";
    div.style.backgroundColor = hex;
    div.style.color = col.bestTextColor(rgb);
    div.insertAdjacentHTML("beforeend", `${hex}; ${col.col2str("rgb", col.hex2rgb(hex))}; ${col.col2str("hsl", col.rgb2hsl(...col.hex2rgb(hex)))}`);
    p.appendChild(div);
    document.body.appendChild(p);
  }
}

function colorSpectra1D() {
  const spectrum = new col.Spectrum_1D("hsl", [-Infinity, 100, 50], [0, 360], col.hsl2rgb);

  const d = spectrum.createInteractive(600, 400);
  document.body.appendChild(d.element);
  d.element.style.border = "1px solid black";
  d.onclick = (e, x, y) => {
    let rgba = d.getRGBAColor(x), str = col.col2str("rgba", rgba);
    div.style.backgroundColor = str;
    span.innerText = col.rgba2hexa(...rgba);
  }
  const div = document.createElement("div");
  div.style.width = div.style.height = "50px";
  div.style.border = "1px solid black";
  document.body.appendChild(div);
  const span = document.createElement("span");
  document.body.appendChild(span);
}

function colorSpectra2D() {
  const spectrum = new col.Spectrum_2D("cmyk", [0, NaN, NaN, 0], [0, 100], [0, 100], col.cmyk2rgb);
  const d = spectrum.createInteractive(600, 400);
  document.body.appendChild(d.element);
  d.element.style.border = "1px solid black";
  d.onclick = (e, x, y) => {
    let rgb = d.getRGBAColor(x, y);
    rgb.pop();
    let str = col.col2str("rgb", rgb);
    div.style.backgroundColor = str;
    span.innerText = col.rgb2hex(rgb[0], rgb[1], rgb[2]);
  }
  const div = document.createElement("div");
  div.style.width = div.style.height = "50px";
  div.style.border = "1px solid black";
  document.body.appendChild(div);
  const span = document.createElement("span");
  document.body.appendChild(span);
}

function divideColorWheel(div: number) {
  let hsl: [number, number, number] = [100, 100, 50];
  const colors = col.getDivisions(div, ...hsl);

  for (const [h, s, l] of colors) {
    let rgb = col.hsl2rgb(h, s, l);

    const p = document.createElement("p");
    const div = document.createElement("div");
    div.style.height = div.style.width = "30px";
    div.style.display = "inline-block";
    div.style.border = "1px solid black";
    div.style.backgroundColor = col.col2str("rgb", rgb);
    p.appendChild(div);
    p.insertAdjacentHTML("beforeend", ` &nbsp;<span>${col.rgb2hex(...rgb)}</span>`);

    document.body.appendChild(p);
  }
}
