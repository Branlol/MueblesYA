// RUTA PRIVADA /panel/admin: inventario simulado.
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { productos } from '../data/products';

export default function Admin() {
  return (
    <Container fluid="lg">
      <h1 className="h3 my-4">Administración de inventario</h1>
      <Table responsive bordered hover>
        <thead><tr><th>ID</th><th>Producto</th><th>Categoría</th><th>Material</th></tr></thead>
        <tbody>
          {productos.map((p) => (<tr key={p.id}><td>{p.id}</td><td>{p.nombre}</td><td>{p.categoria}</td><td>{p.material}</td></tr>))}
        </tbody>
      </Table>
      <p className="small text-muted">En la FASE-II esta tabla se conectará a MySQL mediante la API REST.</p>
    </Container>
  );
}
