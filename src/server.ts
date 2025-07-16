import app from './app';
import config from '../config/env';

app.listen(config.port, () => {
  console.log(`Servidor corriendo en puerto ${config.port} en modo ${config.nodeEnv}`);
});
