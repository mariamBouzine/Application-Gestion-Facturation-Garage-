import { Router } from 'express';
import { ParametresController } from './parametres.controller';

const router = Router();
const parametresController = new ParametresController();

// GET /api/parametres - Get system parameters
router.get('/', parametresController.getParametres);

// PUT /api/parametres - Update system parameters
router.put('/', parametresController.updateParametres);

export default router;