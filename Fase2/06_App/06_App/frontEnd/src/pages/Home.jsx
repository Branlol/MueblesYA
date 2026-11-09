// Página de inicio: titulares, carrusel y diseño a TRES COLUMNAS
// (izquierda: acordeón de ayuda | centro: contenido | derecha: collapse + audio).
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import { api, urlPublica } from '../api/api';
import { useCategorias } from '../api/useCategorias';

// El saludo sonoro se sirve desde la carpeta pública del backend (express.static)
const sonido = urlPublica('/public/media/bienvenida.mp3');

export default function Home() {
  const [abierto, setAbierto] = useState(false); // efecto COLLAPSE
  const categorias = useCategorias();           // categorías desde MySQL
  const [destacados, setDestacados] = useState([]);
  useEffect(() => { api('/productos').then((d) => setDestacados(d.slice(0, 3))).catch(() => {}); }, []);

  return (
    <Container fluid="lg">
      <header className="text-center my-4">
        <h1 className="display-5 fw-bold titulo-marca">MueblesYA</h1>
        <p className="lead">Muebles para cada espacio, con despacho a domicilio.</p>
      </header>

      <HeroCarousel />

      <Row className="mt-4 g-4">
        {/* COLUMNA 1: acordeón */}
        <Col xs={12} md={3}>
          <h2 className="h5">Preguntas frecuentes</h2>
          <Accordion defaultActiveKey="0" flush>
            <Accordion.Item eventKey="0">
              <Accordion.Header>¿Hacen envíos a domicilio?</Accordion.Header>
              <Accordion.Body>Sí. El costo y el tiempo se calculan según tu zona de despacho.</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>¿Qué medios de pago hay?</Accordion.Header>
              <Accordion.Body>Tarjeta y contraentrega (simulados en esta fase).</Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>¿Puedo ver el estado de mi pedido?</Accordion.Header>
              <Accordion.Body>Sí, desde «Mi panel» una vez inicies sesión.</Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>

        {/* COLUMNA 2: contenido principal con letra capital */}
        <Col xs={12} md={6}>
          <h2 className="h4">Bienvenido a tu tienda de muebles</h2>
          <p className="letra-capital">
            MueblesYA nace para que comprar muebles sea sencillo, confiable y cómodo. Explora nuestras
            categorías, compara materiales y recibe tu pedido en la puerta de tu casa. Cada pieza se
            selecciona por su durabilidad, su diseño y su relación entre precio y calidad.
          </p>
          <Row xs={1} sm={2} className="g-3">
            {categorias.slice(0, 4).map((c) => (
              <Col key={c.id}>
                <Card className="h-100 categoria-card">
                  <Card.Img variant="top" src={urlPublica(c.img)} alt={c.nombre} />
                  <Card.Body>
                    <Card.Title className="h6">{c.nombre}</Card.Title>
                    <Card.Text className="small">{c.texto}</Card.Text>
                    <Link to={`/catalogo?cat=${c.slug}`} className="stretched-link small">Ver {c.nombre.toLowerCase()}</Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* COLUMNA 3: collapse + sonido */}
        <Col xs={12} md={3}>
          <h2 className="h5">Despacho a domicilio</h2>
          <Button className="btn-brand mb-2" onClick={() => setAbierto(!abierto)} aria-controls="info-envio" aria-expanded={abierto}>
            {abierto ? 'Ocultar información' : 'Ver cómo funciona'}
          </Button>
          <Collapse in={abierto}>
            <div id="info-envio">
              <Card body className="small">
                1) Elige tus muebles. 2) Indica la dirección. 3) Calculamos costo y tiempo por zona.
                4) Sigue el estado: confirmado, en preparación, en camino y entregado.
              </Card>
            </div>
          </Collapse>
          <h2 className="h5 mt-4">¿No sabes qué elegir?</h2>
          <Card body className="small card-ia">
            Cuéntale a nuestro <b>Asesor IA</b> cuántas personas son, si tienes mascotas y tu presupuesto.
            <div className="mt-2"><Link to="/asesor" className="btn btn-sm btn-brand">Probar el asesor</Link></div>
          </Card>
          <h2 className="h5 mt-4">Saludo sonoro</h2>
          <audio controls className="w-100" src={sonido}>Tu navegador no soporta audio.</audio>
        </Col>
      </Row>

      <section className="mt-5">
        <h2 className="h4 mb-3">Productos destacados</h2>
        <Row xs={1} sm={2} lg={3} className="g-3">
          {destacados.map((p) => (<Col key={p.id}><ProductCard producto={p} /></Col>))}
        </Row>
      </section>
    </Container>
  );
}
