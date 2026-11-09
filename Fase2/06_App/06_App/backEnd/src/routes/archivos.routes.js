import { Router } from 'express';
import { subir, listar, publicos, descargar, ver, eliminar } from '../controllers/archivos.controller.js';
import { requiereAuth, authOpcional } from '../middleware/auth.js';
import { subirArchivo } from '../middleware/upload.js';

const r = Router();
r.get('/publicos', publicos);                              // visitantes
r.get('/:id/ver', authOpcional, ver);                      
r.get('/:id/descargar', authOpcional, descargar);
r.get('/', requiereAuth, listar);                          // privadas
r.post('/', requiereAuth, subirArchivo, subir);
r.delete('/:id', requiereAuth, eliminar);
export default r;