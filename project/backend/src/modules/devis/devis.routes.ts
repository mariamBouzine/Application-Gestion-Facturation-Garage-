import { Router } from 'express';
import { DevisController } from './devis.controller';

const router = Router();
const devisController = new DevisController();

// GET /api/devis - Get all devis
router.get('/', devisController.getDevis);

// GET /api/devis/:id - Get devis by ID
router.get('/:id', devisController.getDevisById);

// POST /api/devis - Create new devis
router.post('/', devisController.createDevis);

// PUT /api/devis/:id - Update devis
router.put('/:id', devisController.updateDevis);

// DELETE /api/devis/:id - Delete devis
router.delete('/:id', devisController.deleteDevis);

// PUT /api/devis/:id/status - Update devis status
router.put('/:id/status', devisController.updateDevisStatus);

export default router;