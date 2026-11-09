import { query } from '../database/connection.js';
import { HttpError, ah } from '../utils/http.js';

function convertir(nombre, def, bruto) {
  if (bruto === undefined || bruto === null || bruto === '') return [undefined, null];
  switch (def.tipo) {
    case 'entero': { const n = Number(bruto); return Number.isInteger(n) && n >= (def.min ?? 0) ? [n, null] : [undefined, `${nombre} debe ser un entero válido.`]; }
    case 'decimal': { const n = Number(bruto); return Number.isFinite(n) && n >= 0 ? [n, null] : [undefined, `${nombre} debe ser un número válido.`]; }
    case 'enum': return def.valores.includes(bruto) ? [bruto, null] : [undefined, `${nombre} debe ser uno de: ${def.valores.join(', ')}.`];
    case 'correo': return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(bruto)) ? [String(bruto).trim(), null] : [undefined, 'Correo inválido.'];
    default: {
      const t = String(bruto).trim();
      return t.length <= (def.max ?? 200) ? [t, null] : [undefined, `${nombre} supera ${def.max ?? 200} caracteres.`];
    }
  }
}
export function crearCrud(cfg) {
  const select = cfg.select || 't.*';
  const base = `SELECT ${select} FROM ${cfg.tabla} t ${cfg.join || ''}`;

  async function validar(body, esNuevo) {
    const datos = {}; const errores = [];
    for (const [col, def] of Object.entries(cfg.campos)) {
      const [valor, err] = convertir(col, def, body[col]);
      if (err) errores.push(err);
      else if (valor !== undefined) datos[col] = valor;
      else if (esNuevo && def.requerido) errores.push(`El campo ${col} es obligatorio.`);
    }
    if (errores.length) throw new HttpError(400, errores.join(' '));
    if (cfg.antesGuardar) await cfg.antesGuardar(datos, body, esNuevo);
    return datos;
  }

  return {
    listar: ah(async (req, res) => {
      const q = String(req.query.q || '').trim();
      const params = []; let where = '';
      if (q && cfg.buscar?.length) {
        where = 'WHERE ' + cfg.buscar.map((c) => `${c} LIKE ?`).join(' OR ');
        cfg.buscar.forEach(() => params.push(`%${q}%`));
      }
      res.json(await query(`${base} ${where} ORDER BY ${cfg.orden || 't.id DESC'} LIMIT 300`, params));
    }),
    // GET /:id
    obtener: ah(async (req, res) => {
      const [fila] = await query(`${base} WHERE t.id = ?`, [Number(req.params.id)]);
      if (!fila) throw new HttpError(404, 'Registro no encontrado.');
      res.json(fila);
    }),
    // POST /
    crear: ah(async (req, res) => {
      const datos = await validar(req.body || {}, true);
      const r = await query(`INSERT INTO ${cfg.tabla} SET ?`, [datos]);
      const [fila] = await query(`${base} WHERE t.id = ?`, [r.insertId]);
      res.status(201).json(fila);
    }),
    // PUT /:id
    actualizar: ah(async (req, res) => {
      const id = Number(req.params.id);
      const datos = await validar(req.body || {}, false);
      if (!Object.keys(datos).length) throw new HttpError(400, 'No hay datos para actualizar.');
      const r = await query(`UPDATE ${cfg.tabla} SET ? WHERE id = ?`, [datos, id]);
      if (!r.affectedRows) throw new HttpError(404, 'Registro no encontrado.');
      const [fila] = await query(`${base} WHERE t.id = ?`, [id]);
      res.json(fila);
    }),
    // DELETE /:id
    eliminar: ah(async (req, res) => {
      const r = await query(`DELETE FROM ${cfg.tabla} WHERE id = ?`, [Number(req.params.id)]);
      if (!r.affectedRows) throw new HttpError(404, 'Registro no encontrado.');
      res.json({ ok: true });
    }),
  };
}
