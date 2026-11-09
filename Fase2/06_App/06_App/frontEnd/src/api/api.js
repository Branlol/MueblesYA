// Cliente HTTP Frontend
const BASE = import.meta.env.VITE_API_URL || ''; // vacío = mismo origen (proxy de Vite o Express en producción)

export const urlPublica = (ruta) => (!ruta ? '' : /^https?:/.test(ruta) ? ruta : BASE + ruta);
export const getToken = () => sessionStorage.getItem('token');

/**
 * api('/productos')                                  GET
 * api('/admin/productos', { metodo:'POST', cuerpo }) JSON
 * api('/archivos', { metodo:'POST', formData })     multipart 
 * Lanza errores usando el .status
 */
export async function api(ruta, { metodo = 'GET', cuerpo, formData } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  let body;
  if (formData) body = formData;
  else if (cuerpo !== undefined) { headers['Content-Type'] = 'application/json'; body = JSON.stringify(cuerpo); }

  let resp;
  try { resp = await fetch(`${BASE}/api${ruta}`, { method: metodo, headers, body }); }
  catch { throw new Error('No hay conexión con el servidor.'); }

  const datos = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const err = new Error(datos.error || `Error ${resp.status}`);
    err.status = resp.status;
    throw err;
  }
  return datos;
}

// Descarga el archivo protegifo
export async function descargarArchivo(id, nombre) {
  const resp = await fetch(`${BASE}/api/archivos/${id}/descargar`, { headers: { Authorization: `Bearer ${getToken()}` } });
  if (!resp.ok) throw new Error('No se pudo descargar el archivo.');
  const url = URL.createObjectURL(await resp.blob());
  const a = document.createElement('a');
  a.href = url; a.download = nombre; a.click();
  URL.revokeObjectURL(url);
}

export const moneda = (n) => Number(n).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
export const fecha = (f) => (f ? new Date(f).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }) : '');
