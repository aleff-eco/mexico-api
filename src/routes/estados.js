import express from 'express';
import { listUnique, searchByField } from '../controllers/queryController.js';

const router = express.Router();

// Columnas que se enviarán en el response
const exportFields = ['d_codigo', 'd_estado', 'd_ciudad', 'D_mnpio'];

// GET /api/estado/ > lista de estados únicos
router.get('/', async (req, res) => {
  try {
    const estados = await listUnique('d_estado');
    res.json(estados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener lista de estados.' });
  }
});

// GET /api/estado/:query > búsqueda por incidencia, mínimo 4 caracteres
router.get('/:query', async (req, res) => {
  try {
    const { page, per_page } = req.query;
    const resultados = await searchByField(
      'd_estado',
      req.params.query,
      exportFields,
      { page, perPage: per_page }
    );
    res.json(resultados);
  } catch (err) {
    res.status(err.code || 500).json({ message: err.message });
  }
});

export default router;

