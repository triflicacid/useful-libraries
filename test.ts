import { TableCreator } from "./libs/TableCreator";

var tc: TableCreator;

document.head.insertAdjacentHTML('beforeend', '<style>table,tr,th,td{border:1px solid #000;}table{border-collapse:collapse;}</style>');

function main() {
  tc = new TableCreator();
  globalThis.tc = tc;

  // tc.fromObject({ c: ['Name', 'Age'], r: [['Ruben', 18], ['Angus', 17]] });
  tc.fromCSV(`Name,Age\n"Ruben S",18\nAngus,17`);

  let div = document.createElement("div"), table;
  document.body.appendChild(div);
  function create() {
    if (table) table.remove();
    table = tc.toInteractiveHTML(create);
    div.appendChild(table);
  }
  create();
}

window.addEventListener("load", main);