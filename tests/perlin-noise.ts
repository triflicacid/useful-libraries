import { perlinNoise } from "../libs/perlin-noise";

window.addEventListener("load", function() {
    const canvas = document.createElement("canvas");
    canvas.style.border = "1px solid black";
    canvas.width = 1000;
    canvas.height = 600;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const dim = 30, n = 3;
    const noise = perlinNoise();
    for (let i = 0, x = 0; x < canvas.width; i++, x += dim) {
        for (let j = 0, y = 0; y < canvas.height; j++, y += dim) {
            const v = noise(i / n, j / n), c = Math.round((v + 1) / 2 * 255);
            ctx.fillStyle = "#" + c.toString(16).padStart(2, "0").repeat(3);
            ctx.fillRect(x, y, dim, dim);
        }
    }
});