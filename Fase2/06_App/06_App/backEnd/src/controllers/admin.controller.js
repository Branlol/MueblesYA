import { crearCrud } from './crud.factory.js';
import { query } from '../database/connection.js';
import { hashClave } from '../utils/security.js';
import { HttpError, ah } from '../utils/http.js';

export const recursos = {
  categorias: crearCrud({
    tabla: 'categorias',
    campos: {
      slug: { tipo: 'texto', requerido: true, max: 30 },
      nombre: { tipo: 'texto', requerido: true, max: 50 },
      texto: { tipo: 'texto', requerido: true, max: 200 },
      img: { tipo: 'texto', requerido: true, max: 200 },
    },
    buscar: ['t.nombre', 't.slug'], orden: 't.id',
  }),

  productos: crearCrud({
    tabla: 'productos',
    select: 't.*, c.nombre AS categoria',
    join: 'JOIN categorias c ON c.id = t.categoria_id',
    campos: {
      nombre: { tipo: 'texto', requerido: true, max: 100 },
      categoria_id: { tipo: 'entero', requerido: true, min: 1 },
      material: { tipo: 'texto', requerido: true, max: 60 },
      precio: { tipo: 'decimal', requerido: true },
      stock: { tipo: 'entero', requerido: true },
      img: { tipo: 'texto', requerido: true, max: 200 },
      detalle: { tipo: 'texto', requerido: true, max: 300 },
    },
    buscar: ['t.nombre', 't.material', 'c.nombre'], orden: 't.id',
  }),

  usuarios: crearCrud({
    tabla: 'usuarios',
    select: 't.id, t.usuario, t.nombre, t.correo, t.rol, t.creado', // nunca se expone clave_hash
    campos: {
      usuario: { tipo: 'texto', requerido: true, max: 30 },
      nombre: { tipo: 'texto', requerido: true, max: 80 },
      correo: { tipo: 'correo', requerido: true },
      rol: { tipo: 'enum', requerido: true, valores: ['admin', 'cliente'] },
      clave: { tipo: 'texto', max: 100 }, // campo virtual: se guarda como hash
    },
    buscar: ['t.usuario', 't.nombre', 't.correo'], orden: 't.id',
    antesGuardar: async (datos, _body, esNuevo) => {
      if (esNuevo && !datos.clave) throw new HttpError(400, 'La clave es obligatoria.');
      if (datos.clave) {
        if (datos.clave.length < 4) throw new HttpError(400, 'La clave debe tener mínimo 4 caracteres.');
        datos.clave_hash = hashClave(datos.clave);
      }
      delete datos.clave;
    },
  }),

  pedidos: crearCrud({
    tabla: 'pedidos',
    select: 't.*, u.usuario AS cliente, p.nombre AS producto',
    join: 'JOIN usuarios u ON u.id = t.usuario_id JOIN productos p ON p.id = t.producto_id',
    campos: {
      usuario_id: { tipo: 'entero', requerido: true, min: 1 },
      producto_id: { tipo: 'entero', requerido: true, min: 1 },
      cantidad: { tipo: 'entero', requerido: true, min: 1 },
      total: { tipo: 'decimal' }, // si no se envia, se calcula precio x cantidad
      direccion: { tipo: 'texto', requerido: true, max: 150 },
      estado: { tipo: 'enum', valores: ['Confirmado', 'En preparación', 'En camino', 'Entregado'] },
    },
    buscar: ['u.usuario', 'p.nombre', 't.estado', 't.direccion'],
    antesGuardar: async (datos, _b, esNuevo) => {
      if (esNuevo && datos.total === undefined) {
        const [p] = await query('SELECT precio FROM productos WHERE id = ?', [datos.producto_id]);
        if (!p) throw new HttpError(400, 'El producto no existe.');
        datos.total = p.precio * datos.cantidad;
      }
    },
  }),

  mensajes: crearCrud({
    tabla: 'mensajes',
    campos: {
      nombre: { tipo: 'texto', requerido: true, max: 80 },
      correo: { tipo: 'correo', requerido: true },
      motivo: { tipo: 'texto', requerido: true, max: 60 },
      mensaje: { tipo: 'texto', requerido: true, max: 2000 },
    },
    buscar: ['t.nombre', 't.correo', 't.motivo', 't.mensaje'],
  }),
};

export const elegirRecurso = (accion) => (req, res, next) => {
  const crud = recursos[req.params.recurso];
  if (!crud) return next(new HttpError(404, 'Recurso desconocido.'));
  return crud[accion](req, res, next);
};

export const imagenSubida = ah(async (req, res) => {
  if (!req.file) throw new HttpError(400, 'Selecciona una imagen.');
  res.status(201).json({ url: `/public/productos/${req.file.filename}` });
});
