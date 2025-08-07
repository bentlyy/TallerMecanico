// src/presentation/routes/mecanicoRoutes.ts
import { Router } from 'express';
import { mecanicoController } from '../../infrastructure/di/container';


const mecanicoRouter = Router();

mecanicoRouter.get('/', mecanicoController.getAll.bind(mecanicoController));
mecanicoRouter.get('/:id', mecanicoController.getById.bind(mecanicoController));
mecanicoRouter.post('/', mecanicoController.create.bind(mecanicoController));
mecanicoRouter.put('/:id', mecanicoController.update.bind(mecanicoController));
mecanicoRouter.delete('/:id', mecanicoController.delete.bind(mecanicoController));

export default mecanicoRouter;