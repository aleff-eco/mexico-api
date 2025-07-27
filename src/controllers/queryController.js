import { normalize } from "../lib/normalize.js";
import { getDb } from "../db/db.js";

/**
 * Devuelve una lista única de valores de un campo determinado desde SQLite.
 * @param {string} field    Nombre del campo en los datos (por ejemplo d_estado o d_ciudad)
 * @param {string[]} exportFields Columnas que se enviarán en el response
 */

export async function listUnique(field, exportFields, opts = {}) {
  let page = parseInt(opts.page, 10);
  let perPage = parseInt(opts.perPage, 10);
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(perPage) || perPage < 1) perPage = 50;
  // if (perPage > 200) perPage = 200;

  const db = getDb();

  const total = await new Promise((res, rej) =>
    db.get(
      `SELECT COUNT(DISTINCT ${field}) AS cnt
        FROM postal_codes
        WHERE ${field} IS NOT NULL AND ${field} != ''`,
      [],
      (err, row) => (err ? rej(err) : res(row.cnt))
    )
  );
  const totalPages = Math.ceil(total / perPage);
  const offset = (page - 1) * perPage;

  const sql = `
    SELECT ${exportFields.join(", ")}
    FROM postal_codes
    WHERE ${field} IS NOT NULL AND ${field} != ''
    GROUP BY ${field}
    ORDER BY ${field} 
    LIMIT ? OFFSET ?
  `;
  const rows = await new Promise((res, rej) =>
    db.all(sql, [perPage, offset], (err, rows) => (err ? rej(err) : res(rows)))
  );

  return {
    meta: {
      page,
      per_page: perPage,
      total,
      total_pages: totalPages,
    },
    data: rows,
  };
}

/**
 * Realiza una búsqueda genérica por campo usando SQLite.
 *
 * @param {string} field    Nombre del campo en los datos (por ejemplo d_estado)
 * @param {string} queryRaw Término de búsqueda crudo proveniente de la URL
 * @param {string[]} exportFields Lista de campos que se incluirán en el resultado
 * @returns {Promise<object[]>} Lista de objetos con los campos solicitados
 */
export async function searchByField(
  field,
  queryRaw,
  exportFields,
  { page = 1, perPage = 50 } = {}
) {
  const rawQuery = (queryRaw || "").trim();
  const isPostalCode = field === "d_codigo";

  // Validaciones de longitud
  if (isPostalCode) {
    if (rawQuery.length !== 5) {
      const err = new Error('El código postal debe tener exactamente 5 caracteres.');
      err.code = 400;
      throw err;
    }
  } else {
    if (rawQuery.length < 4) {
      const err = new Error('La búsqueda debe tener al menos 4 caracteres.');
      err.code = 400;
      throw err;
    }
  }

  // Saneamiento de paginación para búsquedas genéricas
  if (!isPostalCode) {
    page = Math.max(1, page);
    perPage = Math.min(200, Math.max(1, perPage));
  }

  const db = getDb();
  const normQuery = normalize(rawQuery);
  let where;
  let params;

  if (isPostalCode) {
    where = 'd_codigo = ?';
    params = [rawQuery];
  } else {
    // Determinar la columna normalizada correspondiente
    let normField;
    switch (field) {
      case 'd_estado':
        normField = 'norm_d_estado';
        break;
      case 'D_mnpio':
        normField = 'norm_D_mnpio';
        break;
      case 'd_ciudad':
        normField = 'norm_d_ciudad';
        break;
      case 'd_asenta':
        normField = 'norm_d_asenta';
        break;
      default:
        normField = 'norm_' + field;
        break;
    }

    where = `${normField} LIKE ?`;
    params = [`%${normQuery}%`];
  }

  // Conteo previo para búsquedas genéricas
  let total = 0;
  if (!isPostalCode) {
    total = await new Promise((res, rej) =>
      db.get(
        `SELECT COUNT(*) AS cnt FROM postal_codes WHERE ${where}`,
        params,
        (err, row) => (err ? rej(err) : res(row.cnt))
      )
    );
    if (total === 0) {
      const err = new Error(`${field} no encontrado.`);
      err.code = 404;
      throw err;
    }
  }

  // Construcción de SQL con o sin LIMIT/OFFSET
  let sql, finalParams;
  if (isPostalCode) {
    sql = `SELECT ${exportFields.join(", ")} FROM postal_codes WHERE ${where}`;
    finalParams = params;
  } else {
    const offset = (page - 1) * perPage;
    sql = `
      SELECT ${exportFields.join(", ")}
      FROM postal_codes
      WHERE ${where}
      LIMIT ? OFFSET ?
    `;
    finalParams = [...params, perPage, offset];
  }

  // Ejecución de la consulta
  const rows = await new Promise((res, rej) =>
    db.all(sql, finalParams, (err, rows) => (err ? rej(err) : res(rows)))
  );

  // Eliminar duplicados exactos
  const seen = new Set();
  const data = [];
  for (const row of rows) {
    const key = exportFields.map((k) => row[k]).join("|");
    if (!seen.has(key)) {
      seen.add(key);
      data.push(row);
    }
  }

  // Construir meta según tipo de búsqueda
  if (isPostalCode) {
    return {
      meta: {
        page: 1,
        per_page: data.length,
        total: data.length,
        total_pages: 1,
      },
      data,
    };
  } else {
    return {
      meta: {
        page,
        per_page: perPage,
        total,
        total_pages: Math.ceil(total / perPage),
      },
      data,
    };
  }
}

/**
 * Devuelve el bounding box (bbox) de un estado normalizado
 * @param {string} estado Nombre del estado (sin acentuar)
 * @returns {Promise<object>} Objeto con min/max lat/lng
 */
export async function getBboxByEstado(estadoParam) {
  const raw = (estadoParam || "").trim();
  if (raw.length < 4) {
    const err = new Error("La búsqueda debe tener al menos 4 caracteres.");
    err.code = 400;
    throw err;
  }

  // Se quitan los espacios
  const norm = normalize(raw).replace(/\s+/g, "");

  const db = getDb();
  const sql = `
    SELECT estado, min_lat, max_lat, min_lng, max_lng
    FROM estado_bbox
    WHERE LOWER(REPLACE(estado, ' ', '')) LIKE ?
    LIMIT 1
  `;

  const row = await new Promise((resolve, reject) => {
    db.get(sql, [`%${norm}%`], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });

  if (!row) {
    const error = new Error("Estado no encontrado.");
    error.code = 404;
    throw error;
  }

  return {
    bbox: {
      estado: row.estado,
      min_lat: row.min_lat,
      max_lat: row.max_lat,
      min_lng: row.min_lng,
      max_lng: row.max_lng,
    },
  };
}
