import sqlite3 from 'sqlite3';
import path from 'path';

let db;

/**
 * Devuelve una instancia de base de datos SQLite para consultas de solo lectura.
 * La conexión se abre la primera vez que se invoca y se reutiliza en llamadas posteriores.
 */
export function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'src', 'db', 'mexico.db');
    db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
      if (err) {
        console.error('Error al abrir la base de datos SQLite', err);
      }
    });
  }
  return db;
}
