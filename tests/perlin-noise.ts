import { perlinNoise } from "../libs/perlin-noise";

window.addEventListener("load", function() {
    const canvas = document.createElement("canvas");
    canvas.style.border = "1px solid black";
    canvas.width = 1000;
    canvas.height = 600;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    // dim=30,n=3
    function draw(dim: number, n: number) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const noise = perlinNoise();
        for (let i = 0, x = 0; x < canvas.width; i++, x += dim) {
            for (let j = 0, y = 0; y < canvas.height; j++, y += dim) {
                const v = noise(i / n, j / n), c = Math.round((v + 1) / 2 * 255);
                ctx.fillStyle = "#" + c.toString(16).padStart(2, "0").repeat(3);
                ctx.fillRect(x, y, dim, dim);
            }
        }
    }

    document.body.insertAdjacentHTML("beforeend", "<br>");
    const div = document.createElement("span");
    div.insertAdjacentHTML("beforeend", "Dimensions: ");
    const inputDim = document.createElement("input");
    div.appendChild(inputDim);
    inputDim.type = "number";
    inputDim.min = "1";
    inputDim.value = "30";
    inputDim.addEventListener("change", () => {
        draw(+inputDim.value, +inputN.value);
    });
    div.insertAdjacentHTML("beforeend", " | &Nscr;: ");
    const inputN = document.createElement("input");
    div.appendChild(inputN);
    inputN.type = "number";
    inputN.min = "1";
    inputN.value = "5";
    inputN.addEventListener("change", () => {
        draw(+inputDim.value, +inputN.value);
    });
    const btn = document.createElement("button");
    btn.innerText = "Draw";
    btn.addEventListener("click", () => {
        draw(+inputDim.value, +inputN.value);
    });
    div.appendChild(btn);
    document.body.appendChild(div);

    btn.click();
});