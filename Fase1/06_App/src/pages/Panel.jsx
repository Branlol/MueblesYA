// RUTA PRIVADA /panel: resumen para el usuario autenticado.
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Panel() {
  const { usuario } = useAuth();
  return (
    <Container fluid="lg">
      <h1 className="h3 my-4">Panel privado · Bienvenido, {usuario}</h1>
      <Row xs={1} md={2} className="g-3">
        <Col><Card body><Card.Title>Seguimiento de pedidos</Card.Title><Card.Text>Consulta el estado de tus compras.</Card.Text><Link to="/panel/pedidos">Ir a pedidos</Link></Card></Col>
        <Col><Card body><Card.Title>Administración</Card.Title><Card.Text>Inventario y gestión de productos (simulado).</Card.Text><Link to="/panel/admin">Ir a administración</Link></Card></Col>
      </Row>
    </Container>
  );
}
