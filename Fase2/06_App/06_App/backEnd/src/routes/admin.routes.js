import { Router } from 'express';
import { elegirRecurso, imagenSubida } from '../controllers/admin.controller.js';
import { requiereAuth, requiereRol } from '../middleware/auth.js';
import { subirImagenProducto } from '../middleware/upload.js';

const r = Router();
r.use(requiereAuth, requiereRol('admin'));
r.post('/imagen-producto', subirImagenProducto, imagenSubida); // antes de /:recurso
r.get('/:recurso', elegirRecurso('listar'));
r.get('/:recurso/:id', elegirRecurso('obtener'));
r.post('/:recurso', elegirRecurso('crear'));
r.put('/:recurso/:id', elegirRecurso('actualizar'));
r.delete('/:recurso/:id', elegirRecurso('eliminar'));
export default r;
