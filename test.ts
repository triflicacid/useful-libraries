import { RCanv } from './libs/RCanv';

var rcanv: RCanv;

function main() {
  rcanv = RCanv.create(600, 400);
  document.body.appendChild(rcanv.getCanvas());

  rcanv.fill("magenta");
  rcanv.font.size = 37;
  rcanv.text("Hello", rcanv.width / 2, rcanv.height / 2);
}

window.addEventListener("load", main);