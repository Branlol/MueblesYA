import { config } from './src/config/env.js';
import { prepararBaseDeDatos } from './src/database/initDb.js';
import { crearApp } from './src/app.js';

try {
  // Crea la db
  await prepararBaseDeDatos();
  // Arranca el APIREST
  crearApp().listen(config.port, () => {
    console.log(`MueblesYA listo en http://localhost:${config.port}`);
    //Revisa la APIKEY y su funcionamiento
    if (!config.geminiKey) console.log('Aviso: GEMINI_API_KEY vacia; el asesor usara el modo basico (sin IA).');
  });
} catch (err) {
  console.error('No se pudo iniciar el servidor:', err.message);
  console.error('Verifique que MySQL este encendido en XAMPP y revise el archivo .env');
  process.exit(1);
}
