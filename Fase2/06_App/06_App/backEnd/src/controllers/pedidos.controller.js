// Pedidos del cliente logueado
import { query } from '../database/connection.js';
import { HttpError, ah } from '../utils/http.js';

// GET /api/pedidos 
export const mios = ah(async (req, res) => {
  const esAdmin = req.usuario.rol === 'admin';
  res.json(await query(
    `SELECT t.id, t.cantidad, t.total, t.direccion, t.estado, t.creado, p.nombre AS producto, u.usuario AS cliente
       FROM pedidos t JOIN productos p ON p.id = t.producto_id JOIN usuarios u ON u.id = t.usuario_id
      ${esAdmin ? '' : 'WHERE t.usuario_id = ?'} ORDER BY t.id DESC`, esAdmin ? [] : [req.usuario.id]));
});

// POST /api/pedidos { producto_id, cantidad, direccion }
export const crear = ah(async (req, res) => {
  const productoId = Number(req.body?.producto_id);
  const cantidad = Number(req.body?.cantidad || 1);
  const direccion = String(req.body?.direccion || '').trim();
  if (!Number.isInteger(productoId) || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > 20) throw new HttpError(400, 'Datos del pedido inválidos.');
  if (direccion.length < 6 || direccion.length > 150) throw new HttpError(400, 'Indica una dirección de entrega válida.');
  const [p] = await query('SELECT id, precio FROM productos WHERE id = ?', [productoId]);
  if (!p) throw new HttpError(404, 'Producto no encontrado.');
  const upd = await query('UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?', [cantidad, productoId, cantidad]);
  if (!upd.affectedRows) throw new HttpError(409, 'No hay stock suficiente.');
  const r = await query('INSERT INTO pedidos (usuario_id, producto_id, cantidad, total, direccion) VALUES (?, ?, ?, ?, ?)',
    [req.usuario.id, productoId, cantidad, p.precio * cantidad, direccion]);
  res.status(201).json({ id: r.insertId, total: p.precio * cantidad, estado: 'Confirmado' });
});
