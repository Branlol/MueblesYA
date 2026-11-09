// Panel para los usuarios logueados
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Panel() {
  const { usuario, esAdmin } = useAuth();
  return (
    <Container fluid="lg">
      <h1 className="h3 my-4">Panel privado · Bienvenido, {usuario.nombre} <Badge bg={esAdmin ? 'danger' : 'secondary'}>{usuario.rol}</Badge></h1>
      <Row xs={1} md={2} className="g-3">
        <Col><Card body><Card.Title>Seguimiento de pedidos</Card.Title><Card.Text>Consulta el estado de tus compras.</Card.Text><Link to="/panel/pedidos">Ir a pedidos</Link></Card></Col>
        <Col><Card body><Card.Title>Mis archivos</Card.Title><Card.Text>Sube y descarga documentos, imágenes y videos.</Card.Text><Link to="/panel/archivos">Ir a mis archivos</Link></Card></Col>
        <Col><Card body><Card.Title>Asesor IA</Card.Title><Card.Text>Pregunta qué mueble te conviene según tu espacio.</Card.Text><Link to="/asesor">Ir al asesor</Link></Card></Col>
        {esAdmin && <Col><Card body><Card.Title>Administración</Card.Title><Card.Text>Mantenimiento de productos, categorías, usuarios, pedidos y mensajes.</Card.Text><Link to="/panel/admin">Ir a administración</Link></Card></Col>}
      </Row>
    </Container>
  );
}
