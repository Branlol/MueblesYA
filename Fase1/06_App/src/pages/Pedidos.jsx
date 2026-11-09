// RUTA PRIVADA /panel/pedidos: seguimiento de pedidos con datos simulados.
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';

const pedidos = [
  { id: 'P-1001', producto: 'Sofá Nórdico 3 puestos', estado: 'En camino', variante: 'warning' },
  { id: 'P-1002', producto: 'Escritorio Ejecutivo', estado: 'Entregado', variante: 'success' },
  { id: 'P-1003', producto: 'Cama Queen con cabecero', estado: 'En preparación', variante: 'info' },
  { id: 'P-1004', producto: 'Mesa de terraza Teca', estado: 'Confirmado', variante: 'secondary' },
];

export default function Pedidos() {
  return (
    <Container fluid="lg">
      <h1 className="h3 my-4">Seguimiento de pedidos</h1>
      {/* responsive: la tabla hace scroll horizontal en pantallas pequeñas */}
      <Table responsive striped hover>
        <thead><tr><th>N.º</th><th>Producto</th><th>Estado</th></tr></thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id}><td>{p.id}</td><td>{p.producto}</td><td><Badge bg={p.variante}>{p.estado}</Badge></td></tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
