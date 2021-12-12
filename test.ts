import { generateControl } from "./libs/MemoryView";

function main() {
  const wrapper = document.createElement("div");
  document.body.appendChild(wrapper);

  const buffer = new ArrayBuffer(250), dataView = new DataView(buffer);
  const DATA = generateControl({ wrapper, dataView });
  globalThis.DATA = DATA;
  DATA.view.updateScreen(S => {
    S.setWidth(1000);
    S.setHeight(600);
  });
}

globalThis.addEventListener("load", main);