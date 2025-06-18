import { Router } from 'express';
import { FactureController } from './facture.controller';

const router = Router();
const factureController = new FactureController();

// GET /api/factures - Get all factures
router.get('/', factureController.getFactures);

// GET /api/factures/:id - Get facture by ID
router.get('/:id', factureController.getFactureById);

// POST /api/factures - Create new facture
router.post('/', factureController.createFacture);

// PUT /api/factures/:id - Update facture
router.put('/:id', factureController.updateFacture);

// DELETE /api/factures/:id - Delete facture
router.delete('/:id', factureController.deleteFacture);

// PUT /api/factures/:id/payment - Update payment status
router.put('/:id/payment', factureController.updatePaymentStatus);

export default router;