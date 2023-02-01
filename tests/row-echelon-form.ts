import { Matrix } from "../libs/maths/Matrix";

(async function () {
    console.log("-- Before --");
    let matrix = Matrix.fromString("1 1 -1; 1 -1 2; 2 1 1");
    let echo = Matrix.fromString("7; 3; 9");
    console.log(matrix.toString());
    console.log(echo.toString());

    console.log("-- After --");
    let elem = Matrix.toReducedRowEchelonForm(matrix, echo);
    console.log(matrix.toString());
    console.log(echo.toString());

    if (elem.length > 0) {
        console.log("\nElementary Operations:");
        elem.forEach(e => console.log(e.toString()));
        console.log("\nFull Transformation:");
        const comb = Matrix.combineArray(elem);
        console.log(comb.toString());
    }
})();