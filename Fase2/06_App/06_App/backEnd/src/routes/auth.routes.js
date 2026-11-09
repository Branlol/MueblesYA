// Authenticatión Routes
import { Router } from 'express';
import { login, registro, yo } from '../controllers/auth.controller.js';
import { requiereAuth, limitar } from '../middleware/auth.js';

const r = Router();
r.post('/login', limitar({ max: 15 }), login);
r.post('/registro', limitar({ max: 10 }), registro);
r.get('/yo', requiereAuth, yo);
export default r;
