import fs from "fs";
import xml2js from "xml2js";

const parser = new xml2js.Parser({ explicitArray: false });

fs.readFile("./public/files/CPdescarga.xml", "utf8", (err, xml) => {
  if (err) throw err;

  parser.parseString(xml, (err, result) => {
    if (err) throw err;

    const dataset = result.NewDataSet;
    if (!dataset || !dataset.table) {
      console.error("No se encontraron nodos <table> en el XML");
      process.exit(1);
    }

    const tables = Array.isArray(dataset.table)
      ? dataset.table
      : [dataset.table];

    // Mapeo a objeto
    const registros = tables.map((item) => ({
      d_codigo: item.d_codigo || "",
      d_asenta: item.d_asenta || "",
      d_tipo_asenta: item.d_tipo_asenta || "",
      D_mnpio: item.D_mnpio || "",
      d_estado: item.d_estado || "",
      d_ciudad: item.d_ciudad || "",
      d_CP: item.d_CP || "",
      c_estado: item.c_estado || "",
      c_oficina: item.c_oficina || "",
      c_CP: item.c_CP || "",
      c_tipo_asenta: item.c_tipo_asenta || "",
      c_mnpio: item.c_mnpio || "",
      id_asenta_cpcons: item.id_asenta_cpcons || "",
      d_zona: item.d_zona || "",
      c_cve_ciudad: item.c_cve_ciudad || "",
    }));

    // Guardar JSON final
    fs.writeFileSync(
      "./src/db/data.json",
      JSON.stringify(registros, null, 2),
      "utf8"
    );

    console.log(
      `Convertidos ${registros.length} registros en src/db/data.json`
    );
  });
});
