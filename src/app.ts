import express from 'express';
import cors from 'cors';
import clienteRoutes from './presentation/routes/clienteRoutes';
import vehiculoRoutes from './presentation/routes/vehiculoRoutes';


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', clienteRoutes);
app.use("/vehiculos", vehiculoRoutes);
// Agrega más rutas aquí...

export default app;