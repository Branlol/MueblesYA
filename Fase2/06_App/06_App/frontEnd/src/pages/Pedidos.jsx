// Seguimiento de pedidos para el usuario logueado
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Badge from 'react-bootstrap/Badge';
import Alert from 'react-bootstrap/Alert';
import { api, moneda, fecha } from '../api/api';
import { useAuth } from '../context/AuthContext';

const variante = { 'Confirmado': 'secondary', 'En preparación': 'info', 'En camino': 'warning', 'Entregado': 'success' };

export default function Pedidos() {
  const { esAdmin } = useAuth();
  const [pedidos, setPedidos] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api('/pedidos').then(setPedidos).catch((e) => setError(e.message)); }, []);

  return (
    <Container fluid="lg">
      <h1 className="h3 my-4">Seguimiento de pedidos</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {pedidos?.length === 0 && <p>Aún no tienes pedidos. Explora el <a href="/catalogo">catálogo</a>.</p>}
      {pedidos?.length > 0 && (
        /* responsive*/
        <Table responsive striped hover>
          <thead><tr><th>N.º</th>{esAdmin && <th>Cliente</th>}<th>Producto</th><th>Cant.</th><th>Total</th><th>Fecha</th><th>Estado</th></tr></thead>
          <tbody>
            {pedidos.map((p) => (
              <tr key={p.id}><td>P-{1000 + p.id}</td>{esAdmin && <td>{p.cliente}</td>}<td>{p.producto}</td><td>{p.cantidad}</td><td>{moneda(p.total)}</td><td>{fecha(p.creado)}</td>
                <td><Badge bg={variante[p.estado]}>{p.estado}</Badge></td></tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
