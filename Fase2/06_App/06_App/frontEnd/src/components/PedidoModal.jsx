// Modal para pedir pedidos, si el cliente no se ha logueado se le envia a la pestaña de login
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { api, moneda } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function PedidoModal({ producto, cantidadInicial = 1, onHide }) {
  const { autenticado, abrirLogin } = useAuth();
  const [cantidad, setCantidad] = useState(cantidadInicial);
  const [direccion, setDireccion] = useState('');
  const [error, setError] = useState('');
  const [listo, setListo] = useState(false);

  if (!producto) return null;

  const enviar = async (e) => {
    e.preventDefault(); setError('');
    try { await api('/pedidos', { metodo: 'POST', cuerpo: { producto_id: producto.id, cantidad: Number(cantidad), direccion } }); setListo(true); }
    catch (err) { setError(err.message); }
  };

  return (
    <Modal show onHide={onHide} centered>
      <Modal.Header closeButton><Modal.Title className="h5">Pedir: {producto.nombre}</Modal.Title></Modal.Header>
      {!autenticado ? (
        <Modal.Body>
          <p>Para hacer un pedido necesitas iniciar sesión o crear una cuenta.</p>
          <Button className="btn-brand" onClick={() => { onHide(); abrirLogin(); }}>Ingresar / Registrarme</Button>
        </Modal.Body>
      ) : listo ? (
        <Modal.Body>
          <Alert variant="success">¡Pedido confirmado! Puedes seguirlo en <Link to="/panel/pedidos" onClick={onHide}>Seguimiento de pedidos</Link>.</Alert>
          <Button variant="outline-secondary" onClick={onHide}>Cerrar</Button>
        </Modal.Body>
      ) : (
        <Form onSubmit={enviar}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <p className="mb-2">Precio unitario: <b>{moneda(producto.precio)}</b> · Stock: {producto.stock}</p>
            <Form.Group className="mb-3" controlId="pCantidad">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control type="number" min={1} max={Math.max(producto.stock, 1)} value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="pDireccion">
              <Form.Label>Dirección de entrega</Form.Label>
              <Form.Control value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Cra 27 # 18-30, Bucaramanga" minLength={6} maxLength={150} required />
            </Form.Group>
            <p className="fw-bold mb-0">Total: {moneda(producto.precio * (Number(cantidad) || 0))}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={onHide}>Cancelar</Button>
            <Button type="submit" className="btn-brand">Confirmar pedido</Button>
          </Modal.Footer>
        </Form>
      )}
    </Modal>
  );
}
