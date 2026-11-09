import fs from 'node:fs/promises';
import path from 'node:path';
import { query } from '../database/connection.js';
import { DIR_UPLOADS } from '../middleware/upload.js';
import { HttpError, ah } from '../utils/http.js';

const MIME_EN_LINEA = /^(image\/(png|jpe?g|gif|webp)|video\/(mp4|webm|ogg)|audio\/(mpeg|mp3|ogg|wav|webm))$/;
const nombreUtf8 = (n) => Buffer.from(n, 'latin1').toString('utf8'); // multer entrega latin1

async function obtener(id) {
  const [a] = await query('SELECT * FROM archivos WHERE id = ?', [Number(id)]);
  if (!a) throw new HttpError(404, 'Archivo no encontrado.');
  return a;
}
const puedeVer = (a, u) => a.publico || (u && (u.rol === 'admin' || u.id === a.usuario_id));

export const subir = ah(async (req, res) => {
  if (!req.file) throw new HttpError(400, 'Selecciona un archivo.');
  const publico = req.body?.publico === '1' || req.body?.publico === 'true' ? 1 : 0;
  const r = await query(
    'INSERT INTO archivos (usuario_id, nombre_original, nombre_servidor, mime, tamano, publico) VALUES (?, ?, ?, ?, ?, ?)',
    [req.usuario.id, nombreUtf8(req.file.originalname).slice(0, 200), req.file.filename, req.file.mimetype.slice(0, 100), req.file.size, publico]);
  res.status(201).json({ id: r.insertId, nombre: nombreUtf8(req.file.originalname) });
});

export const listar = ah(async (req, res) => {
  const admin = req.usuario.rol === 'admin';
  res.json(await query(
    `SELECT a.id, a.nombre_original, a.mime, a.tamano, a.publico, a.creado, u.usuario AS propietario
       FROM archivos a JOIN usuarios u ON u.id = a.usuario_id ${admin ? '' : 'WHERE a.usuario_id = ?'} ORDER BY a.id DESC`,
    admin ? [] : [req.usuario.id]));
});

export const publicos = ah(async (_req, res) => {
  res.json(await query('SELECT id, nombre_original, mime, tamano, creado FROM archivos WHERE publico = 1 ORDER BY id DESC LIMIT 50'));
});

export const descargar = ah(async (req, res) => {
  const a = await obtener(req.params.id);
  if (!puedeVer(a, req.usuario)) throw new HttpError(403, 'No tienes acceso a este archivo.');
  res.download(path.join(DIR_UPLOADS, a.nombre_servidor), a.nombre_original);
});

export const ver = ah(async (req, res) => {
  const a = await obtener(req.params.id);
  if (!puedeVer(a, req.usuario)) throw new HttpError(403, 'No tienes acceso a este archivo.');
  if (!MIME_EN_LINEA.test(a.mime)) throw new HttpError(415, 'Este tipo de archivo solo se puede descargar.');
  res.type(a.mime).sendFile(path.join(DIR_UPLOADS, a.nombre_servidor));
});

export const eliminar = ah(async (req, res) => {
  const a = await obtener(req.params.id);
  if (req.usuario.rol !== 'admin' && a.usuario_id !== req.usuario.id) throw new HttpError(403, 'No puedes eliminar este archivo.');
  await query('DELETE FROM archivos WHERE id = ?', [a.id]);
  await fs.unlink(path.join(DIR_UPLOADS, a.nombre_servidor)).catch(() => {});
  res.json({ ok: true });
});