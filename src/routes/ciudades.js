import express from 'express';
import { listUnique, searchByField } from '../controllers/queryController.js';

const router = express.Router();

// Columnas que se enviarán en el response
const exportFields = ['d_ciudad', 'd_estado', 'D_mnpio', 'd_codigo'];

// GET /api/ciudad/ > lista de ciudades únicas
router.get('/', async (req, res) => {
  try {
    const ciudades = await listUnique('d_ciudad');
    res.json(ciudades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener ciudades únicas.' });
  }
});

// GET /api/ciudad/:query > búsqueda por incidencia, mínimo 4 caracteres
router.get('/:query', async (req, res) => {
  try {
    const { page, per_page } = req.query;
    const resultados = await searchByField(
    'd_ciudad', 
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
