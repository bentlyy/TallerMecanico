import express from 'express';
import cors from 'cors';
import clienteRoutes from './presentation/routes/clienteRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', clienteRoutes);
// Agrega más rutas aquí...

export default app;