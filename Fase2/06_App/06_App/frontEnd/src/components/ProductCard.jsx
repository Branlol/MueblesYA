//ProductCard, se usa para los productos.
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';
import PedidoModal from './PedidoModal';
import { moneda, urlPublica } from '../api/api';

export default function ProductCard({ producto }) {
  const [verDetalle, setVerDetalle] = useState(false);
  const [pedir, setPedir] = useState(false);
  return (
    <Card className="h-100 product-card">
      <Card.Img variant="top" src={urlPublica(producto.img)} alt={producto.nombre} />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h6">{producto.nombre}</Card.Title>
        <Card.Text className="text-muted small mb-1">{producto.material} · {producto.stock > 0 ? `${producto.stock} disponibles` : 'Agotado'}</Card.Text>
        <Card.Text className="fw-bold">{moneda(producto.precio)}</Card.Text>
        <Fade in={verDetalle}>
          <div>{verDetalle && <p className="small">{producto.detalle}</p>}</div>
        </Fade>
        <div className="mt-auto d-flex gap-2">
          <Button size="sm" variant="outline-secondary" onClick={() => setVerDetalle((v) => !v)} aria-expanded={verDetalle}>
            {verDetalle ? 'Ocultar' : 'Detalle'}
          </Button>
          <Button size="sm" className="btn-brand" disabled={producto.stock < 1} onClick={() => setPedir(true)}>Pedir</Button>
        </div>
      </Card.Body>
      {pedir && <PedidoModal producto={producto} onHide={() => setPedir(false)} />}
    </Card>
  );
}
