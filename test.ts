<<<<<<< HEAD
import { drawArrow, roundedRect } from "./libs/canvasUtils";
=======
import { generateControl } from "./libs/MemoryView";
>>>>>>> c35ef8c774b632b4257e61ce677d783e416f8653

function main() {
  const wrapper = document.createElement("div");
  document.body.appendChild(wrapper);

<<<<<<< HEAD
  drawArrow(ctx, 10, 10, 60, 60, 4, 15);
=======
  const buffer = new ArrayBuffer(500), dataView = new DataView(buffer);
  for (let i = 0; i < buffer.byteLength; i++) dataView.setUint8(i, Math.floor(Math.random() * 255));
  const DATA = generateControl({ wrapper, dataView });
  globalThis.DATA = DATA;
  DATA.view.updateScreen(S => {
    S.setWidth(1000);
    S.setHeight(600);
  });
>>>>>>> c35ef8c774b632b4257e61ce677d783e416f8653
}

globalThis.addEventListener("load", main);