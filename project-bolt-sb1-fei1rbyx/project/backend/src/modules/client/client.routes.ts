import { Router } from 'express';
import { ClientController } from './client.controller';
import { validationMiddleware, clientSchema } from '@/middleware/validation';

const router = Router();
const clientController = new ClientController();

// GET /api/clients - Get all clients with pagination
router.get('/', clientController.getClients);

// GET /api/clients/search - Search clients
router.get('/search', clientController.searchClients);

// GET /api/clients/stats - Get client statistics
router.get('/stats', clientController.getClientStats);

// GET /api/clients/:id - Get client by ID
router.get('/:id', clientController.getClientById);

// POST /api/clients - Create new client
router.post('/', validationMiddleware(clientSchema), clientController.createClient);

// PUT /api/clients/:id - Update client
router.put('/:id', validationMiddleware(clientSchema), clientController.updateClient);

// DELETE /api/clients/:id - Delete client
router.delete('/:id', clientController.deleteClient);

export default router;