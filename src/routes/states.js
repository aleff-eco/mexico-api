import express from 'express';
import { listUnique, searchByField } from '../controllers/queryController.js';

const router = express.Router();

// Columnas que se enviaran en el response
const exportFields = ['d_codigo', 'd_estado', 'd_ciudad', 'D_mnpio'];

// GET /api/estado/ > lista de estados únicos
router.get('/', (_, res) => {
  try {
    const results = listUnique('d_estado');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener lista de estados.' });
  }
});

// GET /api/estado/:query > búsqueda por incidencia, mínimo 4 caracteres
router.get('/:query', (req, res) => {
  try {
    const results = searchByField('d_estado', req.params.query, exportFields);
    res.json(results);
  } catch (err) {
    res.status(err.code || 500).json({ message: err.message });
  }
});

export default router;
