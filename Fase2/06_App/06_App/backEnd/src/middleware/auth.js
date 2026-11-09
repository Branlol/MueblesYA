// Middlewares de autenticacion y autorizacion por rol (token en el encabezado Authorization: Bearer ...).
import { leerToken } from '../utils/security.js';
import { HttpError } from '../utils/http.js';

function extraer(req) {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') ? leerToken(h.slice(7)) : null;
}

// Exige sesion valida
export function requiereAuth(req, _res, next) {
  const u = extraer(req);
  if (!u) return next(new HttpError(401, 'Debes iniciar sesión.'));
  req.usuario = u; next();
}

// Sesion opcional (visitantes tambien pasan; si hay token se identifica al usuario)
export function authOpcional(req, _res, next) {
  req.usuario = extraer(req); next();
}

// Exige un rol concreto (ej. 'admin')
export const requiereRol = (rol) => (req, _res, next) =>
  req.usuario?.rol === rol ? next() : next(new HttpError(403, 'No tienes permisos para esta acción.'));

// Limitador simple en memoria (por IP) para login, registro e IA
export function limitar({ ventanaMs = 60_000, max = 10 } = {}) {
  const golpes = new Map();
  return (req, _res, next) => {
    const ahora = Date.now();
    const lista = (golpes.get(req.ip) || []).filter((t) => ahora - t < ventanaMs);
    if (lista.length >= max) return next(new HttpError(429, 'Demasiados intentos. Espera un momento.'));
    lista.push(ahora); golpes.set(req.ip, lista); next();
  };
}
