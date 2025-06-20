import { Router } from 'express';
import { ODRController } from './odr.controller';

const router = Router();
const odrController = new ODRController();

// GET /api/odr - Get all ODRs
router.get('/', odrController.getODRs);

// GET /api/odr/:id - Get ODR by ID
router.get('/:id', odrController.getODRById);

// POST /api/odr - Create new ODR
router.post('/', odrController.createODR);

// PUT /api/odr/:id - Update ODR
router.put('/:id', odrController.updateODR);

// DELETE /api/odr/:id - Delete ODR
router.delete('/:id', odrController.deleteODR);

// PUT /api/odr/:id/status - Update ODR status
router.put('/:id/status', odrController.updateODRStatus);

export default router;