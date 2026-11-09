// Página 404 para cualquier URL no definida.
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

export default function NotFound() {
  return (
    <Container className="text-center py-5">
      <h1 className="display-4">404</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </Container>
  );
}
