// Manejo centralizado de errores, para su entendimiento
export function noEncontrado(_req, res) {
  res.status(404).json({ error: 'Ruta de la API no encontrada.' });
}

export function manejarErrores(err, _req, res, _next) {
  if (err.status) return res.status(err.status).json({ error: err.message });
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'El archivo supera el tamaño permitido.' : 'Error al subir el archivo.' });
  }
  // Errores de MySQL mas comunes, traducidos a mensajes mas entendibles
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Ya existe un registro con ese valor único (usuario, correo o nombre).' });
  if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'El registro relacionado (categoría, usuario o producto) no existe.' });
  if (err.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ error: 'No se puede eliminar: tiene registros relacionados.' });
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
}
