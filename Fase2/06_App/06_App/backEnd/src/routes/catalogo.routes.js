import { Router } from 'express';
import { categorias, productos, producto } from '../controllers/catalogo.controller.js';
import { enviar } from '../controllers/contacto.controller.js';
import { limitar } from '../middleware/auth.js';

const r = Router();
r.get('/categorias', categorias);
r.get('/productos', productos);
r.get('/productos/:id', producto);
r.post('/contacto', limitar({ max: 10 }), enviar);
export default r;
