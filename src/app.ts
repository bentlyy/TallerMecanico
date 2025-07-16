import express from 'express';
import cors from 'cors';
import clienteRoutes from './presentation/routes/clienteRoutes';
import vehiculoRoutes from './presentation/routes/vehiculoRoutes';
import usuarioRoutes from "./presentation/routes/usuarioRoutes";
import rolRoutes from "./presentation/routes/rolRoutes";
// import mecanicoRoutes from "./presentation/routes/mecanicoRoutes";
// import piezaRoutes from "./presentation/routes/piezaRoutes";
// import detalleReparacionRoutes from "./presentation/routes/detalleReparacionRoutes";
// import facturaRoutes from "./presentation/routes/facturaRoutes";


// import reparacionRoutes from './presentation/routes/reparacionRoutes'
import 'reflect-metadata';


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Taller Mecánico funcionando' });
});

app.use('/api/clientes', clienteRoutes);
app.use("/vehiculos", vehiculoRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/roles", rolRoutes);
// app.use("/api/mecanicos", mecanicoRoutes);
// app.use("/api/piezas", piezaRoutes);
// app.use('/api/reparaciones', reparacionRoutes);
// app.use("/api/detalle-reparacion", detalleReparacionRoutes);
// app.use("/api/facturas", facturaRoutes);
// Agrega más rutas aquí...

export default app;