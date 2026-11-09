// Galería turística (máximo 3 imágenes) servida por el SERVIDOR DE CONTENIDOS: express.static (/public/turismo).
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { urlPublica } from '../api/api';

const lugares = [
  { archivo: 'catedral-bucaramanga.svg', titulo: 'Catedral de la Sagrada Familia', ciudad: 'Bucaramanga', texto: 'Templo en pleno centro de la Ciudad Bonita, junto al Parque García Rovira.' },
  { archivo: 'giron-colonial.svg', titulo: 'Centro histórico de Girón', ciudad: 'Girón', texto: 'Calles empedradas y casas coloniales, Monumento Nacional y destino ideal para caminar.' },
  { archivo: 'jardin-botanico-floridablanca.svg', titulo: 'Jardín Botánico Eloy Valenzuela', ciudad: 'Floridablanca', texto: 'Zona verde con especies nativas, perfecta para un plan en familia.' },
];

export default function Bucaramanga() {
  return (
    <Container fluid="lg">
      <h1 className="h3 my-4">Conoce Bucaramanga y su área metropolitana</h1>
      <p>MueblesYA despacha a toda el área metropolitana. Estos son algunos lugares para visitar mientras llega tu pedido.</p>
      <Row xs={1} md={3} className="g-4">
        {lugares.map((l) => (
          <Col key={l.archivo}>
            <Card className="h-100 categoria-card">
              <Card.Img variant="top" src={urlPublica(`/public/turismo/${l.archivo}`)} alt={`${l.titulo}, ${l.ciudad}`} />
              <Card.Body>
                <Card.Title className="h6">{l.titulo}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted small">{l.ciudad}</Card.Subtitle>
                <Card.Text className="small">{l.texto}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      
    </Container>
  );
}
