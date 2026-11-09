// Seguridad.
import crypto from 'node:crypto';
import { config } from '../config/env.js';

export function hashClave(clave) {
  const sal = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(clave, sal, 64).toString('hex');
  return `scrypt$${sal}$${hash}`;
}

export function verificarClave(clave, guardada) {
  const [alg, sal, hash] = String(guardada).split('$');
  if (alg !== 'scrypt' || !sal || !hash) return false;
  const calculado = crypto.scryptSync(clave, sal, 64);
  const esperado = Buffer.from(hash, 'hex');
  return calculado.length === esperado.length && crypto.timingSafeEqual(calculado, esperado);
}

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const firmar = (data) => crypto.createHmac('sha256', config.jwtSecret).update(data).digest('base64url');

export function crearToken(payload, horas = 8) {
  const cuerpo = b64({ ...payload, exp: Math.floor(Date.now() / 1000) + horas * 3600 });
  const cabecera = b64({ alg: 'HS256', typ: 'JWT' });
  return `${cabecera}.${cuerpo}.${firmar(`${cabecera}.${cuerpo}`)}`;
}

export function leerToken(token) {
  try {
    const [h, c, f] = String(token).split('.');
    const esperada = Buffer.from(firmar(`${h}.${c}`));
    const recibida = Buffer.from(f || '');
    if (esperada.length !== recibida.length || !crypto.timingSafeEqual(esperada, recibida)) return null;
    const payload = JSON.parse(Buffer.from(c, 'base64url').toString());
    return payload.exp > Date.now() / 1000 ? payload : null;
  } catch { return null; }
}
