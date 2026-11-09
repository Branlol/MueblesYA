// Error Http
export class HttpError extends Error {
  constructor(status, mensaje) { super(mensaje); this.status = status; }
}
export const ah = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
