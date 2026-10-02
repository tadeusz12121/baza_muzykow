const INSTRUMENTS = [
  "Altówka", "Akordeon", "Banjo", "Fortepian", "Flet poprzeczny", "Flet prosty",
  "Gitara akustyczna", "Gitara elektryczna", "Gitara klasyczna", "Gitara basowa",
  "Gitara basowa(akustyczna)", "Harmonijka ustna", "Harfa", "Klarnet", "Kontrabas",
  "Mandolina", "Obój", "Organy", "Perkusja", "Saksofon altowy", "Saksofon barytonowy",
  "Saksofon sopranowy", "Syntezator", "Tamburyn", "Trąbka", "Ukulele", "Wibrafon",
  "Wokal Żeński", "Wokal Męski", "Wiolonczela", "Skrzypce", "Puzon", "Róg",
  "Rhodes/pianino elektryczne", "Cajon"
];

function fillInstrumentSelect(select, placeholder) {
  select.appendChild(new Option(placeholder, ""));
  INSTRUMENTS.forEach(i => select.appendChild(new Option(i, i)));
}

function addInstrumentSelect(value = "") {
  const list = document.getElementById("instrumentList");
  const isFirst = list.children.length === 0;

  const row = document.createElement("div");
  row.className = "instrument-row";

  const select = document.createElement("select");
  select.name = "instruments";
  select.required = isFirst; // pierwszy instrument obowiązkowy
  fillInstrumentSelect(select, "Wybierz instrument");
  select.value = value;
  row.appendChild(select);

  if (!isFirst) {
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "✕";
    remove.onclick = () => row.remove();
    row.appendChild(remove);
  }
  list.appendChild(row);
}
