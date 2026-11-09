// Router principal API
import { Router } from 'express';
import auth from './auth.routes.js';
import catalogo from './catalogo.routes.js';
import pedidos from './pedidos.routes.js';
import archivos from './archivos.routes.js';
import ia from './ia.routes.js';
import admin from './admin.routes.js';

const api = Router();
api.get('/salud', (_req, res) => res.json({ ok: true }));
api.use('/auth', auth);
api.use('/pedidos', pedidos);
api.use('/archivos', archivos);
api.use('/ia', ia);
api.use('/admin', admin);
api.use('/', catalogo);
export default api;
