import { createComplexExpression, createExpression } from "./libs/expression-create";
import { createComplexFieldLine, Graph } from "./libs/Graph";

function main() {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 600;
  document.body.appendChild(canvas);

  const graph = new Graph();
  window.graph = graph;
  graph.addLine(createComplexFieldLine(createComplexExpression("z ** 2").parse()));
  graph.sketch(canvas);
}

window.addEventListener("load", main);