import express from 'express';
import { listUnique, searchByField } from '../controllers/queryController.js';

const router = express.Router();

// Columnas que se enviarán en el response
const exportFields = ['d_asenta', 'd_tipo_asenta', 'D_mnpio', 'd_estado', 'd_ciudad', 'd_codigo'];

// GET /api/colonia/ > lista de colonias únicas
router.get('/', async (req, res) => {
  try {
    const colonias = await listUnique('d_asenta');
    res.json(colonias);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener colonias únicas.' });
  }
});

// GET /api/colonia/:query > búsqueda por incidencia, mínimo 4 caracteres
router.get('/:query', async (req, res) => {
  try {
    const { page, per_page } = req.query;
    const resultados = await searchByField(
      'd_asenta', 
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
