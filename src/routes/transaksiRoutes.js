// Transaksi routes here
import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { mulai, selesai, getAll } from '../controllers/transaksiController.js';
const router = express.Router();

router.use(authenticateToken);
router.post('/mulai', mulai);
router.put('/selesai/:id', selesai);
router.get('/', getAll);

export default router;
