import fs from "fs";
import iconv from "iconv-lite";

const buffer = fs.readFileSync("./public/files/CPdescarga.txt");
const raw = iconv.decode(buffer, "win1252");
const lines = raw.trim().split("\n");

const headers = lines[1].split("|");
const dataLines = lines.slice(2);

// Parseo de los datos para archivos TXT
const jsonData = dataLines.map((line) => {
  const values = line.split("|");
  const entry = {};
  headers.forEach((key, index) => {
    entry[key.trim()] = values[index]?.trim() || "";
  });
  return entry;
});

fs.writeFileSync(
  "./src/db/data.json",
  JSON.stringify(jsonData, null, 2),
  "utf8"
);

console.log(`Convertidos ${jsonData.length} registros en src/db/data.json`);
