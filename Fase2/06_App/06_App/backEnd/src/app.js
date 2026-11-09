// middlewares, (express.static), API.
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import api from './routes/index.js';
import { noEncontrado, manejarErrores } from './middleware/errores.js';
import { DIR_PUBLIC } from './middleware/upload.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function crearApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(cors());
  app.use(express.json({ limit: '100kb' }));
  app.use((_req, res, next) => { res.setHeader('X-Content-Type-Options', 'nosniff'); next(); });

  // Servidor de contenidos, aca se muestran las foticos de Bucaramanga
  app.use('/public', express.static(DIR_PUBLIC, { maxAge: '1h' }));

  // API REST
  app.use('/api', api, noEncontrado);

  const dist = path.join(raiz, 'frontEnd', 'dist');
  if (fs.existsSync(dist)) {
    app.use(express.static(dist));
    app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  }

  app.use(manejarErrores);
  return app;
}