import { Router } from "express";
import { UsuarioController } from "../controllers/usuarioController";
import { container } from "../../infrastructure/di/container";

const router = Router();
const controller = new UsuarioController(container.usuarioService);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
