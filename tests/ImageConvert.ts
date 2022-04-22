import { ImageConvert } from "../libs/ImageConvert";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = 750;
canvas.height = 500;
canvas.style.border = "1px solid black";

let K: ImageConvert;

let p = document.createElement("p");
document.body.appendChild(p);
let btn = document.createElement("button");
btn.innerText = "Upload";
btn.addEventListener("click", () => upload.click());
p.appendChild(btn);
let upload = document.createElement("input");
upload.type = "file";
upload.addEventListener("change", async () => {
    let file = upload.files?.[0];
    if (file) {
        let blob = new Blob([file]);
        K = await ImageConvert.fromDataURL(URL.createObjectURL(blob));
        console.log(K)
        K.drawToCanvas(canvas, canvas.width, canvas.height);
    }
});

btn = document.createElement("button");
btn.innerText = "Download Image";
let downloadAs: string = "image/png";
btn.addEventListener("click", async () => {
    let url = await K.toDataURL(downloadAs as any);
    let link = document.createElement("a");
    link.href = url;
    link.download = "image." + downloadAs.substring(6);
    link.click();
});
let select = document.createElement("select");
select.insertAdjacentHTML("beforeend", "<option value='image/png'>PNG</option>");
select.insertAdjacentHTML("beforeend", "<option value='image/jpeg'>JPEG</option>");
select.insertAdjacentHTML("beforeend", "<option value='image/webp'>WEBP</option>");
select.insertAdjacentHTML("beforeend", "<option value='image/bmp'>Bitmap</option>");
select.addEventListener("change", () => downloadAs = select.value);
p.appendChild(btn);
p.insertAdjacentHTML("beforeend", " as ");
p.appendChild(select);