// Catálogo público con filtro por categoría (parámetro ?cat=) y buscador.
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ProductCard from '../components/ProductCard';
import { categorias, productos } from '../data/products';

export default function Catalogo() {
  const [params, setParams] = useSearchParams();
  const [texto, setTexto] = useState('');
  const cat = params.get('cat') || '';

  const lista = productos.filter((p) =>
    (!cat || p.categoria === cat) && p.nombre.toLowerCase().includes(texto.toLowerCase())
  );

  return (
    <Container fluid="lg">
      <h1 className="h3 my-4">Catálogo de muebles</h1>
      <Row className="g-3 mb-4">
        <Col md={6}>
          <Form.Control type="search" placeholder="Buscar producto…" aria-label="Buscar producto" value={texto} onChange={(e) => setTexto(e.target.value)} />
        </Col>
        <Col md={6}>
          <Form.Select aria-label="Filtrar por categoría" value={cat} onChange={(e) => (e.target.value ? setParams({ cat: e.target.value }) : setParams({}))}>
            <option value="">Todas las categorías</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </Form.Select>
        </Col>
      </Row>
      {lista.length === 0 ? <p>No se encontraron productos.</p> : (
        <Row xs={1} sm={2} lg={3} className="g-3">
          {lista.map((p) => <Col key={p.id}><ProductCard producto={p} /></Col>)}
        </Row>
      )}
    </Container>
  );
}
