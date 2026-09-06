const fs = require("fs");

const data = fs.readFileSync("SIMC_Urzedowy_2026-09-06.csv", "utf8");

const miejscowosci = [...new Set(
    data 
        .split(/\r?\n/)
        .map(line => line.split(";"))
        .filter(row => row[4] === "01" || row[4] === "96")
        .map(row => row[6])
        .filter(Boolean)
)]

fs.writeFileSync (
    "cities.json",
    JSON.stringify(miejscowosci, null, 2),
    "utf8"
);


console.log(`zapisano ${miejscowosci.length} miejscowosci`)