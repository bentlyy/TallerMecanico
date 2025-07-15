import { Router } from "express";
import {
  crearVehiculo,
  obtenerVehiculos,
  obtenerPorCliente,
} from "../controllers/vehiculoController";

const router = Router();

router.get("/", obtenerVehiculos);
router.get("/cliente/:clienteId", obtenerPorCliente);
router.post("/", crearVehiculo);

export default router;
