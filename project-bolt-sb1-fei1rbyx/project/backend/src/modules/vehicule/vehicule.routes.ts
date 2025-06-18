import { Router } from 'express';
import { VehiculeController } from './vehicule.controller';
import { validationMiddleware, vehiculeSchema } from '@/middleware/validation';

const router = Router();
const vehiculeController = new VehiculeController();

// GET /api/vehicules - Get all vehicules
router.get('/', vehiculeController.getVehicules);

// GET /api/vehicules/search - Search vehicules
router.get('/search', vehiculeController.searchVehicules);

// GET /api/vehicules/:id - Get vehicule by ID
router.get('/:id', vehiculeController.getVehiculeById);

// POST /api/vehicules - Create new vehicule
router.post('/', validationMiddleware(vehiculeSchema), vehiculeController.createVehicule);

// PUT /api/vehicules/:id - Update vehicule
router.put('/:id', validationMiddleware(vehiculeSchema), vehiculeController.updateVehicule);

// DELETE /api/vehicules/:id - Delete vehicule
router.delete('/:id', vehiculeController.deleteVehicule);

export default router;