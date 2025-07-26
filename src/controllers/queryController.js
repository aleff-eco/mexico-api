import { normalize } from '../lib/normalize.js';
import { getDb } from '../db/db.js';

/**
 * Devuelve una lista única de valores de un campo determinado desde SQLite.
 * @param {string} field Campo a extraer
 * @returns {Promise<string[]>} Lista de valores únicos
 */
export async function listUnique(field) {
  const db = getDb();
  const sql = `SELECT DISTINCT ${field} FROM postal_codes WHERE ${field} IS NOT NULL AND ${field} != ''`;
  return new Promise((resolve, reject) => {
    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      const result = rows.map(row => row[field]);
      resolve(result);
    });
  });
}

/**
 * Realiza una búsqueda genérica por campo usando SQLite.
 *
 * @param {string} field    Nombre del campo en los datos (por ejemplo d_estado)
 * @param {string} queryRaw Término de búsqueda crudo proveniente de la URL
 * @param {string[]} exportFields Lista de campos que se incluirán en el resultado
 * @returns {Promise<object[]>} Lista de objetos con los campos solicitados
 */
export async function searchByField(field, queryRaw, exportFields, { page = 1, perPage = 50 } = {}) {
  const rawQuery = (queryRaw || '').trim();
  const isPostalCode = field === 'd_codigo';

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

  if (page < 1) page = 1;
  if (perPage < 1) perPage = 1;
  if (perPage > 200) perPage = 200;

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

  const total = await new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) AS cnt FROM postal_codes WHERE ${where}`, params, (err, row) => {
      if (err) return reject(err);
      resolve(row.cnt);
    });
  });

  if (total === 0) {
    const notFoundMsg = isPostalCode ? 'Código postal no encontrado.' : `${field} no encontrado.`;
    const error = new Error(notFoundMsg);
    error.code = 404;
    throw error;
  }

  const offset = (page - 1) * perPage;
  const sql = `SELECT ${exportFields.join(', ')} FROM postal_codes WHERE ${where} LIMIT ? OFFSET ?`;

  return new Promise((resolve, reject) => {
    db.all(sql, [...params, perPage, offset], (err, rows) => {
      if (err) return reject(err);

      // Eliminar duplicados
      const seen = new Set();
      const results = [];
      for (const row of rows) {
        const obj = {};
        exportFields.forEach((key) => {
          if (row[key] !== undefined) obj[key] = row[key];
        });
        const keyString = exportFields.map((k) => obj[k]).join('|');
        if (!seen.has(keyString)) {
          seen.add(keyString);
          results.push(obj);
        }
      }

      resolve({
        meta: {
          page,
          per_page: perPage,
          total,
          total_pages: Math.ceil(total / perPage)
        },
        data: results
      });
    });
  });
}

/**
 * Devuelve el bounding box (bbox) de un estado normalizado
 * @param {string} estado Nombre del estado (sin acentuar)
 * @returns {Promise<object>} Objeto con min/max lat/lng
 */
export async function getBboxByEstado(estado) {
  const db = getDb();
  const normEstado = normalize(estado);

  const sql = `
    SELECT min_lat, max_lat, min_lng, max_lng
    FROM estado_bbox
    WHERE LOWER(REPLACE(estado, ' ', '')) = ?
  `;

  return new Promise((resolve, reject) => {
    db.get(sql, [normEstado.replace(/\s+/g, '').toLowerCase()], (err, row) => {
      if (err) return reject(err);
      if (!row) {
        const error = new Error('Estado no encontrado.');
        error.code = 404;
        return reject(error);
      }
      resolve(row);
    });
  });
}

