import { imageToAscii } from "../libs/image-to-ascii";

let charsets = [
  `Ñ@#W$9876543210?!abc;:+=-,._ `,
  `█▓▒░|;:,. `,
  // `█▓▒░:. `,
  "@QB#NgWM8RDHdOKq9$6khEPXwmeZaoS2yjufF]}{tx1zv7lciL/\\|?*>r^;:_\"~,'.-`",
  "¶@ØÆMåBNÊßÔR#8Q&mÃ0À$GXZA5ñk2S%±3Fz¢yÝCJf1t7ªLc¿+?(r/¤²!*;\" ^:,'.`",
  "ᛥᛤᛞᚥᚸᛰᛖᚻᚣᛄᚤᛒᚢᚱᛱᚷᚫᛪᚧᚬᚠᛏᚨᚰᚩᚮᚪᚳᚽᚿᛊᛁᛵᛍ᛬ᚲᛌ᛫",
  "╬╠╫╋║╉╩┣╦╂╳╇╈┠╚┃╃┻╅┳┡┢┹╀╧┱╙┗┞┇┸┋┯┰┖╲╱┎╘━┭┕┍┅╾│┬┉╰╭╸└┆╺┊─╌┄┈╴╶",
  "█▉▇▓▊▆▅▌▚▞▀▒▐▍▃▖▂░▁▏",
  "◙◘■▩●▦▣◚◛◕▨▧◉▤◐◒▮◍◑▼▪◤▬◗◭◖◈◎◮◊◫▰◄◯□▯▷▫▽◹△◁▸▭◅▵◌▱▹▿◠◃◦◟◞◜",
  "ぽぼゑぜぬあおゆぎゐはせぢがきぱびほげばゟぁたかぞぷれひずどらさでけぉちごえすゎにづぇとょついこぐうぅぃくっしへゞゝ゚゙",
];
let chars = charsets[1];
let w = 128, h = 64, fontSize = 7;
let playing = false;

/** Start livestream from <video/>. Every animation loop, convert image capture to ASCII and output to <div/> */
async function startCam(video: HTMLVideoElement, div: HTMLDivElement) {
  if (navigator.mediaDevices.getUserMedia) {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    playing = true;
    const canvas = new OffscreenCanvas(w, h), ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
    const pre = document.createElement("pre");
    div.innerHTML = "";
    div.appendChild(pre);
    pre.style.backgroundColor = "#000";
    pre.style.color = "#FFF";
    pre.style.fontFamily = "Consolas";
    pre.style.fontSize = fontSize + "px";

    requestAnimationFrame(function loop() {
      if (playing) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const string = imageToAscii(canvas, chars);
        pre.innerHTML = string;
        requestAnimationFrame(loop);
      }
    });
  } else {
    return false;
  }
}

/** Terminate livestream from <video /> */
function stopCam(video: HTMLVideoElement) {
  playing = false;
  const stream = video.srcObject;
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(t => t.stop());
  }
  video.srcObject = null;
}

window.addEventListener("load", async function main() {
  const video = document.createElement("video");
  video.autoplay = true;
  // document.body.appendChild(video);
  // document.body.insertAdjacentHTML("beforeend", "<hr>");

  const btnPlay = document.createElement("button");
  btnPlay.innerText = "Start Stream";
  btnPlay.addEventListener("click", () => startCam(video, div));
  this.document.body.appendChild(btnPlay);
  const btnStop = document.createElement("button");
  btnStop.innerText = "Stop Stream";
  btnStop.addEventListener("click", () => stopCam(video));
  document.body.appendChild(btnStop);
  const btnClear = document.createElement("button");
  btnClear.innerText = "Clear";
  btnClear.addEventListener("click", () => (div.innerHTML = ""));
  document.body.appendChild(btnClear);

  const div = document.createElement("div");
  document.body.appendChild(div);

  document.body.insertAdjacentHTML("beforeend", "<br>");
  document.body.insertAdjacentHTML("beforeend", "Characters (light to dark): ");
  const charInput = document.createElement("input");
  charInput.value = chars;
  charInput.style.width = "50%";
  charInput.addEventListener("change", () => (chars = charInput.value));
  document.body.appendChild(charInput);

  document.body.insertAdjacentHTML("beforeend", "<br>");
  document.body.insertAdjacentHTML("beforeend", "Predefined charsets: ");
  const charsetsInput = document.createElement("select");
  charsets.forEach((c, i) => charsetsInput.innerHTML += `<option value="${i}"${c === chars ? " selected" : ""}>${c}</option>`);
  charsetsInput.addEventListener("change", () => {
    chars = charsets[+charsetsInput.value];
    charInput.value = chars;
  });
  document.body.appendChild(charsetsInput);
  document.body.insertAdjacentHTML("beforeend", "<br>");
  document.body.insertAdjacentHTML("beforeend", "Dimensions (px): ");
  const inputWidth = document.createElement("input");
  inputWidth.type = "number";
  inputWidth.value = w.toString();
  inputWidth.addEventListener("change", () => (w = +inputWidth.value));
  document.body.appendChild(inputWidth);
  document.body.insertAdjacentHTML("beforeend", " by ");
  const inputHeight = document.createElement("input");
  inputHeight.type = "number";
  inputHeight.value = h.toString();
  inputHeight.addEventListener("change", () => (h = +inputHeight.value));
  document.body.appendChild(inputHeight);
  document.body.insertAdjacentHTML("beforeend", "<br>");
  document.body.insertAdjacentHTML("beforeend", "Dimensions (px): ");
  document.body.insertAdjacentHTML("beforeend", "<br>");
  document.body.insertAdjacentHTML("beforeend", "Font Size: ");
  const fontSizeInput = document.createElement("input");
  fontSizeInput.type = "number";
  fontSizeInput.value = fontSize.toString();
  fontSizeInput.addEventListener("change", () => (fontSize = +fontSizeInput.value));
  document.body.appendChild(fontSizeInput);
  document.body.insertAdjacentHTML("beforeend", " px");
});