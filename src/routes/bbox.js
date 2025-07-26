import express from 'express';
import { getBboxByEstado } from '../controllers/queryController.js';

const router = express.Router();

// GET /api/bbox/:estado > retorna solo el bounding box de un estado
router.get('/:estado', async (req, res) => {
  const estado = req.params.estado;

  try {
    const bbox = await getBboxByEstado(estado);

    res.json({
      estado,
      bbox
    });
  } catch (err) {
    console.error('Error en /api/bbox:', err);
    res.status(err.code || 500).json({ message: err.message });
  }
});

export default router;

