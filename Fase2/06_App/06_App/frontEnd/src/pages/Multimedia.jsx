// Página pública  con video y sonido
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { api, urlPublica } from '../api/api';

const video = urlPublica('/public/media/promo.mp4');
const sonido = urlPublica('/public/media/bienvenida.mp3');

// Muestra cada archivo según su tipo: imagen, video, audio o enlace de descarga
function ArchivoPublico({ a }) {
  const ver = urlPublica(`/api/archivos/${a.id}/ver`);
  const bajar = urlPublica(`/api/archivos/${a.id}/descargar`);
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title className="h6 text-break">{a.nombre_original}</Card.Title>
        {a.mime.startsWith('image/') && <img src={ver} alt={a.nombre_original} className="img-fluid rounded mb-2" />}
        {a.mime.startsWith('video/') && <video src={ver} controls preload="metadata" className="w-100 mb-2" />}
        {a.mime.startsWith('audio/') && <audio src={ver} controls className="w-100 mb-2" />}
        <a href={bajar} className="small">Descargar archivo</a>
      </Card.Body>
    </Card>
  );
}

export default function Multimedia() {
  const [publicos, setPublicos] = useState([]);
  useEffect(() => { api('/archivos/publicos').then(setPublicos).catch(() => {}); }, []);

  return (
    <Container fluid="lg">
      <h1 className="h3 my-4">Multimedia</h1>
      <Row className="g-4">
        <Col lg={8}>
          <h2 className="h5">Video promocional</h2>
          {/* ratio-16x9 de Bootstrap mantiene la proporción en cualquier pantalla */}
          <div className="ratio ratio-16x9">
            <video controls preload="metadata" title="Video promocional MueblesYA">
              <source src={video} type="video/mp4" />
              Tu navegador no soporta video HTML5.
            </video>
          </div>
          <p className="small mt-2"><a href={video} download="promo-mueblesya.mp4">Descargar video</a></p>
        </Col>
        <Col lg={4}>
          <h2 className="h5">Sonido ambiente</h2>
          <audio controls className="w-100" src={sonido}>Tu navegador no soporta audio.</audio>
          <p className="small mt-2">(express.static).</p>
        </Col>
      </Row>
      <h2 className="h5 mt-5">Archivos compartidos por la comunidad</h2>
      {publicos.length === 0 ? <p className="small text-muted">Aún no hay archivos públicos. Los usuarios registrados pueden compartirlos desde «Mis archivos».</p> : (
        <Row xs={1} sm={2} lg={3} className="g-3">{publicos.map((a) => <Col key={a.id}><ArchivoPublico a={a} /></Col>)}</Row>
      )}
    </Container>
  );
}
