import { SegmentDisplay } from "./libs/SegmentDisplay";
import { sleep } from "./libs/utils";

function main() {
  var canvas = document.createElement('canvas');
  canvas.style.border = "1px solid black";
  canvas.width = 800;
  canvas.height = 600;
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var seg = new SegmentDisplay(300, 300);

  (async function () {
    let n = 0, t = 250;
    while (true) {
      seg.value = n;
      seg.display(ctx);
      await sleep(t);
      n++;
      if (n > 15) {
        await sleep(2 * t);
        n = 0;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  })();
}

window.addEventListener("load", main);