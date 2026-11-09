import { query } from '../database/connection.js';
import { HttpError, ah } from '../utils/http.js';

export const categorias = ah(async (_req, res) => {
  res.json(await query('SELECT id, slug, nombre, texto, img FROM categorias ORDER BY id'));
});

// GET /api/productos?cat=salas&q=sofa
export const productos = ah(async (req, res) => {
  const params = []; const cond = [];
  if (req.query.cat) { cond.push('c.slug = ?'); params.push(String(req.query.cat)); }
  if (req.query.q) { cond.push('p.nombre LIKE ?'); params.push(`%${String(req.query.q).trim()}%`); }
  const where = cond.length ? 'WHERE ' + cond.join(' AND ') : '';
  res.json(await query(
    `SELECT p.id, p.nombre, p.material, p.precio, p.stock, p.img, p.detalle, c.slug AS categoria, c.nombre AS categoria_nombre
       FROM productos p JOIN categorias c ON c.id = p.categoria_id ${where} ORDER BY p.id`, params));
});

export const producto = ah(async (req, res) => {
  const [p] = await query(
    `SELECT p.*, c.slug AS categoria FROM productos p JOIN categorias c ON c.id = p.categoria_id WHERE p.id = ?`,
    [Number(req.params.id)]);
  if (!p) throw new HttpError(404, 'Producto no encontrado.');
  res.json(p);
});
