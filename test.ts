import { FileUploader } from "./libs/FileUpload";

var fu: FileUploader;

function main() {
  const btnContainer = document.createElement("div");
  document.body.appendChild(btnContainer);
  const listContainer = document.createElement("div");
  document.body.appendChild(listContainer);

  fu = new FileUploader();
  fu.attach(btnContainer, listContainer);
  globalThis.fu = fu;
}

window.addEventListener("load", main);