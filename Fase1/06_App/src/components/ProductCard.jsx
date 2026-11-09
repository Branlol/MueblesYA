// Tarjeta de producto reutilizable. Incluye efecto FADE (react-bootstrap) en el detalle.
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Fade from 'react-bootstrap/Fade';

const moneda = (n) => n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export default function ProductCard({ producto }) {
  const [verDetalle, setVerDetalle] = useState(false);
  return (
    <Card className="h-100 product-card">
      <Card.Img variant="top" src={producto.img} alt={producto.nombre} />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h6">{producto.nombre}</Card.Title>
        <Card.Text className="text-muted small mb-1">{producto.material}</Card.Text>
        <Card.Text className="fw-bold">{moneda(producto.precio)}</Card.Text>
        <Fade in={verDetalle}>
          <div>{verDetalle && <p className="small">{producto.detalle}</p>}</div>
        </Fade>
        <div className="mt-auto d-flex gap-2">
          <Button size="sm" variant="outline-secondary" onClick={() => setVerDetalle((v) => !v)} aria-expanded={verDetalle}>
            {verDetalle ? 'Ocultar' : 'Detalle'}
          </Button>
          <Button size="sm" className="btn-brand" disabled title="El carrito se implementa en la FASE-II">Agregar al carrito</Button>
        </div>
      </Card.Body>
    </Card>
  );
}
