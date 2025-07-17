import fs from 'fs';
import { normalize } from '../lib/normalize.js';

const raw = fs.readFileSync(
  new URL('../db/data.json', import.meta.url),
  'utf8'
);
const data = JSON.parse(raw);

// Array de estados, ciudades y municipios únicos
export function listUnique(field) {
  return [...new Set(data.map((item) => item[field]).filter(Boolean))];
}

// Busqueda generica por incidencia (minimo 4 caracteres), normalizando texto y evitando duplicados.
export function searchByField(field, queryRaw, exportFields) {
  const rawQuery = (queryRaw || '').trim();
  const isPostalCode = field === 'd_codigo';

  // Validacion: codigos postales requieren exactamente 5 caracteres
  if (isPostalCode) {
    if (rawQuery.length !== 5) {
      const err = new Error('El código postal debe tener exactamente 5 caracteres.');
      err.code = 400;
      throw err;
    }
  } else {
    // Validacion generica: minimo 4 caracteres
    if (rawQuery.length < 4) {
      const err = new Error('La búsqueda debe tener al menos 4 caracteres.');
      err.code = 400;
      throw err;
    }
  }

  const resultsRaw = isPostalCode
    ? data.filter((item) => item[field] === rawQuery)
    : data.filter((item) => normalize(item[field]).includes(normalize(rawQuery)));

  if (!resultsRaw.length) {
    const err = new Error(isPostalCode ? 'Código postal no encontrado.' : `${field} no encontrado.`);
    err.code = 404;
    throw err;
  }

  // Eliminar duplicados y mapear columnas
  const seen = new Set();
  const results = [];

  for (const item of resultsRaw) {
    const obj = {};
    exportFields.forEach((key) => {
      if (item[key] !== undefined) obj[key] = item[key];
    });
    const keyString = exportFields.map((k) => obj[k]).join('|');
    if (!seen.has(keyString)) {
      seen.add(keyString);
      results.push(obj);
    }
  }

  return results;
}
