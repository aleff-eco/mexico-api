import express from 'express';
import { listUnique, searchByField } from '../controllers/queryController.js';

const router = express.Router();

// Columnas que se enviaran en el response
const exportFields = ['d_ciudad', 'd_estado', 'D_mnpio', 'd_codigo'];

// GET /api/ciudad/ > lista de ciudades únicas
router.get('/', (req, res) => {
  try {
    const ciudades = listUnique('d_ciudad');
    res.json(ciudades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener ciudades únicas.' });
  }
});

// GET /api/ciudad/:query > búsqueda por incidencia, mínimo 4 caracteres
router.get('/:query', (req, res) => {
  try {
    const resultados = searchByField('d_ciudad', req.params.query, exportFields);
    res.json(resultados);
  } catch (err) {
    // err.code es 400 si la búsqueda es muy corta, o 404 si no hay resultados
    res.status(err.code || 500).json({ message: err.message });
  }
});

export default router;
