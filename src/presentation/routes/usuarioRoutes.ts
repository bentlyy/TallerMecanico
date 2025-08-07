// src/presentation/routes/usuarioRoutes.ts
import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarioController';
import { usuarioService } from '../../infrastructure/di/container';

const usuarioController = new UsuarioController(usuarioService);

const usuarioRouter = Router();

// Obtener todos los usuarios
usuarioRouter.get('/', usuarioController.getAll.bind(usuarioController));

// Obtener un usuario por ID
usuarioRouter.get('/:id', usuarioController.getById.bind(usuarioController));

// Crear un nuevo usuario
usuarioRouter.post('/', usuarioController.create.bind(usuarioController));

// Actualizar un usuario
usuarioRouter.put('/:id', usuarioController.update.bind(usuarioController));

// Eliminar un usuario
usuarioRouter.delete('/:id', usuarioController.delete.bind(usuarioController));

// Activar usuario
usuarioRouter.patch('/:id/activate', usuarioController.activate.bind(usuarioController));

// Desactivar usuario
usuarioRouter.patch('/:id/deactivate', usuarioController.deactivate.bind(usuarioController));

export default usuarioRouter;