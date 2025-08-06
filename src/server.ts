import app from './app';
import config from '../config/env';

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${config.port} en modo ${config.nodeEnv}`);
});

