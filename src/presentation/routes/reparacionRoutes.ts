import { Router } from "express";
import { ReparacionController } from "../controllers/reparacionController";
import { container } from "../../infrastructure/di/container";

const router = Router();
const controller = new ReparacionController(container.reparacionService);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
