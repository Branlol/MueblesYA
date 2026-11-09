// Página pública con VIDEO y SONIDO (elementos HTML5 multimedia).
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import video from '../assets/video/promo.mp4';
import sonido from '../assets/audio/bienvenida.mp3';

export default function Multimedia() {
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
        </Col>
        <Col lg={4}>
          <h2 className="h5">Sonido ambiente</h2>
          <audio controls className="w-100" src={sonido}>Tu navegador no soporta audio.</audio>
          <p className="small mt-2">Archivos de ejemplo generados para la demostración; pueden sustituirse por los definitivos.</p>
        </Col>
      </Row>
    </Container>
  );
}
