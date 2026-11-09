// Configuracion de lasubida de archivos al server
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { HttpError } from '../utils/http.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const DIR_UPLOADS = path.join(raiz, 'uploads');           
export const DIR_PUBLIC = path.join(raiz, 'public');             
export const DIR_PRODUCTOS = path.join(DIR_PUBLIC, 'productos'); 
for (const d of [DIR_UPLOADS, DIR_PRODUCTOS]) fs.mkdirSync(d, { recursive: true });

const nombreAleatorio = (original) =>
  crypto.randomBytes(12).toString('hex') + path.extname(original).toLowerCase().slice(0, 10);

export const subirArchivo = multer({
  storage: multer.diskStorage({
    destination: DIR_UPLOADS,
    filename: (_r, f, cb) => cb(null, nombreAleatorio(f.originalname)),
  }),
  limits: { fileSize: 25 * 1024 * 1024, files: 1 },
}).single('archivo');

export const subirImagenProducto = multer({
  storage: multer.diskStorage({
    destination: DIR_PRODUCTOS,
    filename: (_r, f, cb) => cb(null, 'prod_' + nombreAleatorio(f.originalname)),
  }),
  limits: { fileSize: 3 * 1024 * 1024, files: 1 },
  fileFilter: (_r, f, cb) =>
    ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(f.mimetype)
      ? cb(null, true) : cb(new HttpError(400, 'Solo imágenes JPG, PNG, WEBP o GIF.')),
}).single('imagen');

// Foto para el asesor de IA
export const subirFotoIA = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024, files: 1 },
  fileFilter: (_r, f, cb) =>
    ['image/jpeg', 'image/png', 'image/webp'].includes(f.mimetype)
      ? cb(null, true) : cb(new HttpError(400, 'La foto debe ser JPG, PNG o WEBP.')),
}).single('foto');
