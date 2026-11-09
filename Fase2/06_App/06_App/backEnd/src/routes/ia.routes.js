// Rutas del asesor IA, el asesor es público y el historial es privado
import { Router } from 'express';
import { asesor, historial } from '../controllers/ia.controller.js';
import { requiereAuth, authOpcional, limitar } from '../middleware/auth.js';
import { subirFotoIA } from '../middleware/upload.js';

const r = Router();
r.post('/asesor', limitar({ max: 8 }), authOpcional, subirFotoIA, asesor);
r.get('/historial', requiereAuth, historial);
export default r;
