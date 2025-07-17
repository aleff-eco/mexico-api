import express from 'express';
import { searchByField } from '../controllers/queryController.js';

const router = express.Router();

// Columnas que se enviaran en el response
const exportFields = ['d_codigo','d_estado','d_ciudad','d_asenta','D_mnpio','d_tipo_asenta'];

// GET /api/codigo-postal/:cp > búsqueda exacta de código postal
router.get('/:cp', (req, res) => {
  try {
    const results = searchByField('d_codigo', req.params.cp.trim(), exportFields);
    res.json(results);
  } catch (err) {
    res.status(err.code || 500).json({ message: err.message });
  }
});

export default router;
