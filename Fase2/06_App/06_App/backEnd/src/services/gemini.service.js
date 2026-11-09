// Conexión con la APIREST DE GEMINIAI, LA apikey está en el  .env
import { config } from '../config/env.js';
import { HttpError } from '../utils/http.js';

export const geminiDisponible = () => Boolean(config.geminiKey);

/**
 * @param {string} sistema   instrucciones del asesor (rol y reglas)
 * @param {string} usuario   datos del cliente y catalogo
 * @param {{mime:string, buffer:Buffer}|null} imagen  foto opcional (multimodal)
 */
export async function consultarGemini(sistema, usuario, imagen = null) {
  const partes = [{ text: usuario }];
  if (imagen) partes.push({ inline_data: { mime_type: imagen.mime, data: imagen.buffer.toString('base64') } });

  const cuerpo = JSON.stringify({
    system_instruction: { parts: [{ text: sistema }] },
    contents: [{ role: 'user', parts: partes }],
    generationConfig: { temperature: 0.6, responseMimeType: 'application/json' },
  });
  const modelos = [config.geminiModel, config.geminiModeloRespaldo].filter((m, i, a) => m && a.indexOf(m) === i);
  const ESPERA = (ms) => new Promise((r) => setTimeout(r, ms));
  let resp = null;

  for (const modelo of modelos) {
    for (let intento = 1; intento <= 2; intento++) {
      try {
        resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelo)}:generateContent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': config.geminiKey },
          body: cuerpo,
          signal: AbortSignal.timeout(60_000),
        });
      } catch (e) {
        console.error(`Gemini (${modelo}) intento ${intento}: ${e.name} - ${e.message}`, e.cause ? `| causa: ${e.cause.code || e.cause.message}` : '');
        resp = null;
        if (intento < 2) await ESPERA(1500);
        continue;
      }
      if (resp.ok) break;
      if ((resp.status === 503 || resp.status === 429) && intento < 2) {
        console.error(`Gemini (${modelo}) respondio ${resp.status}, reintentando...`);
        await ESPERA(2000);
        continue;
      }
      break;
    }
    if (resp && resp.ok) break;
    if (resp) console.error(`Gemini (${modelo}) fallo con`, resp.status, (await resp.text()).slice(0, 300));
  }

  if (!resp) throw new HttpError(502, 'No fue posible conectar con Gemini.');
  if (!resp.ok) throw new HttpError(502, `Gemini respondió con error ${resp.status}.`);
  const data = await resp.json();
  const texto = (data.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('').trim();
  if (!texto) throw new HttpError(502, 'Gemini no devolvió contenido (posible filtro de seguridad).');
  try {
    return JSON.parse(texto.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''));
  } catch {
    throw new HttpError(502, 'La respuesta de Gemini no tuvo el formato esperado.');
  }
}