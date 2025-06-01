// Playstation routes here
import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getAll, create, update, remove } from '../controllers/playstationController.js';
const router = express.Router();

router.use(authenticateToken);
router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
