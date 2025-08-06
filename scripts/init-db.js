import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs/promises';
import path from 'path';
import { normalize } from '../src/lib/normalize.js';

const dbPath = path.join(process.cwd(), 'src', 'db', 'mexico.db');
const jsonPath = path.join(process.cwd(), 'src', 'db', 'data.json');
const bboxPath = path.join(process.cwd(), 'src', 'db', 'bbox.json');

async function initializeDatabase() {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Optimización de rendimiento
    await db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA synchronous = NORMAL;
    `);

    // Crear tabla postal_codes con columnas normalizadas
    await db.exec(`
      CREATE TABLE IF NOT EXISTS postal_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        d_codigo TEXT,
        d_asenta TEXT,
        d_tipo_asenta TEXT,
        D_mnpio TEXT,
        d_estado TEXT,
        d_ciudad TEXT,
        d_CP TEXT,
        c_estado TEXT,
        c_oficina TEXT,
        c_CP TEXT,
        c_tipo_asenta TEXT,
        c_mnpio TEXT,
        id_asenta_cpcons TEXT,
        d_zona TEXT,
        c_cve_ciudad TEXT,
        norm_d_estado TEXT,
        norm_D_mnpio TEXT,
        norm_d_ciudad TEXT,
        norm_d_asenta TEXT
      );
    `);

    // Borrar contenido existente para evitar duplicados
    await db.exec('DELETE FROM postal_codes');

    // Insertar datos desde data.json con campos normalizados
    const data = JSON.parse(await fs.readFile(jsonPath, 'utf8'));

    const stmt = await db.prepare(`
      INSERT INTO postal_codes (
        d_codigo, d_asenta, d_tipo_asenta, D_mnpio, d_estado,
        d_ciudad, d_CP, c_estado, c_oficina, c_CP,
        c_tipo_asenta, c_mnpio, id_asenta_cpcons, d_zona, c_cve_ciudad,
        norm_d_estado, norm_D_mnpio, norm_d_ciudad, norm_d_asenta
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    await db.exec('BEGIN TRANSACTION');
    for (const record of data) {
      await stmt.run(
        record.d_codigo,
        record.d_asenta,
        record.d_tipo_asenta,
        record.D_mnpio,
        record.d_estado,
        record.d_ciudad,
        record.d_CP,
        record.c_estado,
        record.c_oficina,
        record.c_CP,
        record.c_tipo_asenta,
        record.c_mnpio,
        record.id_asenta_cpcons,
        record.d_zona,
        record.c_cve_ciudad,
        normalize(record.d_estado),
        normalize(record.D_mnpio),
        normalize(record.d_ciudad), 
        normalize(record.d_asenta)
      );
    }
    await db.exec('COMMIT');
    await stmt.finalize();
    console.log('Datos de postal_codes insertados correctamente.');

    // Crear índices para columnas normalizadas (mejora de búsqueda)
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_norm_d_estado ON postal_codes(norm_d_estado);
      CREATE INDEX IF NOT EXISTS idx_norm_D_mnpio ON postal_codes(norm_D_mnpio);
      CREATE INDEX IF NOT EXISTS idx_norm_d_ciudad ON postal_codes(norm_d_ciudad);
      CREATE INDEX IF NOT EXISTS idx_norm_d_asenta ON postal_codes(norm_d_asenta);
    `);

    // Crear tabla estado_bbox si no existe
    await db.exec(`
      CREATE TABLE IF NOT EXISTS estado_bbox (
        estado TEXT PRIMARY KEY,
        min_lat REAL,
        max_lat REAL,
        min_lng REAL,
        max_lng REAL
      );
    `);

    // Insertar BBOX solo si está vacía
    const bboxExists = await db.get(`SELECT COUNT(*) AS count FROM estado_bbox`);
    if (bboxExists.count === 0) {
      const bboxData = JSON.parse(await fs.readFile(bboxPath, 'utf8'));
      const stmtBbox = await db.prepare(`
        INSERT INTO estado_bbox (estado, min_lat, max_lat, min_lng, max_lng)
        VALUES (?, ?, ?, ?, ?)
      `);

      await db.exec('BEGIN TRANSACTION');
      for (const b of bboxData) {
        await stmtBbox.run(b.estado, b.min_lat, b.max_lat, b.min_lng, b.max_lng);
      }
      await db.exec('COMMIT');
      await stmtBbox.finalize();

      console.log('Bounding boxes insertados correctamente.');
    } else {
      console.log('Tabla estado_bbox ya contiene datos. Se omite inserción.');
    }

    await db.close();
    console.log('Base de datos inicializada correctamente.');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
}

initializeDatabase();

