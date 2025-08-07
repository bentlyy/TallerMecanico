//app.ts
import express from 'express';
import cors from 'cors';
import * as client from 'prom-client'; 

import clienteRoutes from './presentation/routes/clienteRoutes';
import vehiculoRoutes from './presentation/routes/vehiculoRoutes';
import rolRoutes from "./presentation/routes/rolRoutes";
import usuarioRoutes from "./presentation/routes/usuarioRoutes";
 import mecanicoRoutes from "./presentation/routes/mecanicoRoutes";
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
app.use("/api/vehiculos", vehiculoRoutes);
app.use("/api/roles", rolRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/mecanicos", mecanicoRoutes);
// app.use("/api/piezas", piezaRoutes);
// app.use('/api/reparaciones', reparacionRoutes);
// app.use("/api/detalle-reparacion", detalleReparacionRoutes);
// app.use("/api/facturas", facturaRoutes);
// Agrega más rutas aquí...

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});



export default app;