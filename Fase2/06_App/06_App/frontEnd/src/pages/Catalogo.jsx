// Catálogo público: los productos se consultan a la API (MySQL) con filtro por categoría (?cat=) y buscador.
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import ProductCard from '../components/ProductCard';
import { api } from '../api/api';
import { useCategorias } from '../api/useCategorias';

export default function Catalogo() {
  const [params, setParams] = useSearchParams();
  const [texto, setTexto] = useState('');
  const [lista, setLista] = useState(null);
  const [error, setError] = useState('');
  const categorias = useCategorias();
  const cat = params.get('cat') || '';

  // Consulta a la API cada vez que cambia la categoría o el texto (con una pequeña espera)
  useEffect(() => {
    const t = setTimeout(() => {
      const qs = new URLSearchParams();
      if (cat) qs.set('cat', cat);
      if (texto.trim()) qs.set('q', texto.trim());
      api(`/productos?${qs}`).then((d) => { setLista(d); setError(''); }).catch((e) => setError(e.message));
    }, 250);
    return () => clearTimeout(t);
  }, [cat, texto]);

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
            {categorias.map((c) => <option key={c.id} value={c.slug}>{c.nombre}</option>)}
          </Form.Select>
        </Col>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
      {!lista && !error ? <Spinner animation="border" role="status" /> : lista?.length === 0 ? <p>No se encontraron productos.</p> : (
        <Row xs={1} sm={2} lg={3} className="g-3">
          {lista?.map((p) => <Col key={p.id}><ProductCard producto={p} /></Col>)}
        </Row>
      )}
    </Container>
  );
}
