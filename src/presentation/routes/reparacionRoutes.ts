import { Router } from 'express';
import { ReparacionController } from '../controllers/reparacionController'; // Importa la clase
import { reparacionService } from '../../infrastructure/di/container'; // Importa el servicio

// Crea la instancia del controlador aquí
const reparacionController = new ReparacionController(reparacionService);

const router = Router();

router.get('/', reparacionController.getAll.bind(reparacionController));
router.get('/:id', reparacionController.getById.bind(reparacionController));
router.post('/', reparacionController.create.bind(reparacionController));
router.put('/:id', reparacionController.update.bind(reparacionController));
router.delete('/:id', reparacionController.delete.bind(reparacionController));

router.post('/:id/estado', reparacionController.cambiarEstado.bind(reparacionController));
router.post('/:id/mecanico', reparacionController.asignarMecanico.bind(reparacionController));
router.post('/:id/salida', reparacionController.registrarSalida.bind(reparacionController));

router.get('/:id/detalles', reparacionController.getDetalles.bind(reparacionController));
router.post('/:id/detalles', reparacionController.addDetalle.bind(reparacionController));
router.delete('/:id/detalles/:piezaId', reparacionController.removeDetalle.bind(reparacionController));

router.get('/vehiculo/:vehiculoId', reparacionController.getPorVehiculo.bind(reparacionController));
router.get('/mecanico/:mecanicoId', reparacionController.getPorMecanico.bind(reparacionController));
router.get('/recepcionista/:usuarioId', reparacionController.getPorRecepcionista.bind(reparacionController));

export default router;