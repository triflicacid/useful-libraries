import { generateControl } from "../libs/MemoryView";
function main() {
  const wrapper = document.createElement("div");
  document.body.appendChild(wrapper);
  const buffer = new ArrayBuffer(0), dataView = new DataView(buffer);
  const ctrl = generateControl({ wrapper, dataView });
  ctrl.view.updateScreen(S => {
    S.setWidth(window.innerWidth * 0.95);
    S.setHeight(window.innerHeight * 0.75);
  });
}
globalThis.addEventListener("load", main);