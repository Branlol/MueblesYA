// Formulario de contacto
import { query } from '../database/connection.js';
import { HttpError, ah } from '../utils/http.js';

export const enviar = ah(async (req, res) => {
  const { nombre, correo, motivo, mensaje } = req.body || {};
  if (!nombre || String(nombre).trim().length < 3) throw new HttpError(400, 'Ingresa tu nombre.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo || '')) throw new HttpError(400, 'Correo inválido.');
  if (!motivo) throw new HttpError(400, 'Selecciona un motivo.');
  if (!mensaje || String(mensaje).trim().length < 10) throw new HttpError(400, 'El mensaje debe tener al menos 10 caracteres.');
  await query('INSERT INTO mensajes (nombre, correo, motivo, mensaje) VALUES (?, ?, ?, ?)',
    [String(nombre).trim().slice(0, 80), String(correo).trim(), String(motivo).slice(0, 60), String(mensaje).trim().slice(0, 2000)]);
  res.status(201).json({ ok: true });
});
