import container from '@infrastructure/di';
import { ReparacionController } from '@presentation/controllers';

const app = express();
const reparacionCtrl = new ReparacionController(container.reparacionRepo);

app.post('/reparaciones', (req, res) => reparacionCtrl.crear(req, res));