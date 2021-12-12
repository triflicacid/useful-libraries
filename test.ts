import { generateControl } from "./libs/MemoryView";

function main() {
  const wrapper = document.createElement("div");
  document.body.appendChild(wrapper);

  const buffer = new ArrayBuffer(500), dataView = new DataView(buffer);
  for (let i = 0; i < buffer.byteLength; i++) dataView.setUint8(i, Math.floor(Math.random() * 255));
  const DATA = generateControl({ wrapper, dataView });
  globalThis.DATA = DATA;
  DATA.view.updateScreen(S => {
    S.setWidth(1000);
    S.setHeight(600);
  });
}

globalThis.addEventListener("load", main);