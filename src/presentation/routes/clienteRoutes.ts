import { Router } from 'express';
import { ClienteController } from '../controllers/clienteController';
import { ClienteService } from '../../application/clienteService';
import { clienteRepository } from '../../infrastructure/di/container';

const router = Router();
const clienteService = new ClienteService(clienteRepository);
const clienteController = new ClienteController(clienteService);

router.post('/clientes', clienteController.create);
// Otras rutas...

export default router;