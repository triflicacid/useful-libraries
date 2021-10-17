import Popup from "./libs/Popup";

function main() {
  let popup = new Popup('Example Popup');
  popup.insertAdjacentHTML('beforeend', `<p style='color: red'>The current time is ${new Date()}</p>`);
  popup.show();
  popup.setCloseCallback(() => {
    console.log("On Close!");
  })
}

window.addEventListener("load", main);