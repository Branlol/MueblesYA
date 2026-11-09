import { query } from '../database/connection.js';
import { crearToken, hashClave, verificarClave } from '../utils/security.js';
import { HttpError, ah } from '../utils/http.js';

const publico = (u) => ({ id: u.id, usuario: u.usuario, nombre: u.nombre, correo: u.correo, rol: u.rol });
const respuesta = (u) => ({ token: crearToken({ id: u.id, usuario: u.usuario, rol: u.rol }), usuario: publico(u) });

export const login = ah(async (req, res) => {
  const { usuario, clave } = req.body || {};
  if (!usuario || !clave) throw new HttpError(400, 'Ingresa usuario y contraseña.');
  const [u] = await query('SELECT * FROM usuarios WHERE usuario = ?', [String(usuario).trim()]);
  if (!u || !verificarClave(String(clave), u.clave_hash)) throw new HttpError(401, 'Usuario o contraseña incorrectos.');
  res.json(respuesta(u));
});

export const registro = ah(async (req, res) => {
  const { usuario, nombre, correo, clave } = req.body || {};
  if (!usuario || !nombre || !correo || !clave) throw new HttpError(400, 'Completa todos los campos.');
  if (!/^[A-Za-z0-9_.-]{3,30}$/.test(usuario)) throw new HttpError(400, 'Usuario: 3 a 30 caracteres (letras, números, _ . -).');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) throw new HttpError(400, 'Correo inválido.');
  if (String(clave).length < 4) throw new HttpError(400, 'La contraseña debe tener mínimo 4 caracteres.');
  const r = await query('INSERT INTO usuarios (usuario, nombre, correo, clave_hash, rol) VALUES (?, ?, ?, ?, ?)',
    [usuario.trim(), String(nombre).trim().slice(0, 80), correo.trim(), hashClave(String(clave)), 'cliente']);
  const [u] = await query('SELECT * FROM usuarios WHERE id = ?', [r.insertId]);
  res.status(201).json(respuesta(u));
});

export const yo = ah(async (req, res) => {
  const [u] = await query('SELECT * FROM usuarios WHERE id = ?', [req.usuario.id]);
  if (!u) throw new HttpError(401, 'La sesión ya no es válida.');
  res.json(publico(u));
});