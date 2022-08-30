import { IOConsole } from "../libs/Console";

async function main() {
    const wrapper = document.createElement("div");
    document.body.appendChild(wrapper);
    const console = new IOConsole(wrapper);
    console.print("Hello, World");
  
    // Asynchronous input
    let inp = await console.inputAsync("What's your name? ");
    console.print("Hello, " + inp);

    // Synchronous input (with callback)
    //console.inputCallback("What's your name? ", name => console.print("Hello, " + name));
  }
  
  main();