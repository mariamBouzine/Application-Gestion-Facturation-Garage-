import { Router } from 'express';
import { PrestationController } from './prestation.controller';
import { validationMiddleware, prestationSchema } from '@/middleware/validation';

const router = Router();
const prestationController = new PrestationController();

// GET /api/prestations - Get all prestations
router.get('/', prestationController.getPrestations);

// GET /api/prestations/carrosserie - Get carrosserie prestations
router.get('/carrosserie', prestationController.getPrestationsCarrosserie);

// GET /api/prestations/mecanique - Get mecanique prestations
router.get('/mecanique', prestationController.getPrestationsMecanique);

// GET /api/prestations/:id - Get prestation by ID
router.get('/:id', prestationController.getPrestationById);

// POST /api/prestations - Create new prestation
router.post('/', validationMiddleware(prestationSchema), prestationController.createPrestation);

// PUT /api/prestations/:id - Update prestation
router.put('/:id', validationMiddleware(prestationSchema), prestationController.updatePrestation);

// DELETE /api/prestations/:id - Delete prestation
router.delete('/:id', prestationController.deletePrestation);

export default router;