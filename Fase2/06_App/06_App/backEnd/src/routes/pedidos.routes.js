// Rutas PRIVADAS de pedidos
import { Router } from 'express';
import { mios, crear } from '../controllers/pedidos.controller.js';
import { requiereAuth } from '../middleware/auth.js';

const r = Router();
r.use(requiereAuth);
r.get('/', mios);
r.post('/', crear);
export default r;
