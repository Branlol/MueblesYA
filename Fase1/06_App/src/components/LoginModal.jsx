// Modal de Bootstrap con el patrón de login (Admin | 1234).
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ show, onHide }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const enviar = (e) => {
    e.preventDefault();
    if (login(user.trim(), pass)) {
      setError(''); setUser(''); setPass('');
      onHide();
      navigate('/panel'); // al validar, se despliega el menú de rutas privadas
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered aria-labelledby="titulo-login">
      <Form onSubmit={enviar}>
        <Modal.Header closeButton>
          <Modal.Title id="titulo-login">Iniciar sesión</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3" controlId="loginUser">
            <Form.Label>Usuario</Form.Label>
            <Form.Control value={user} onChange={(e) => setUser(e.target.value)} placeholder="Admin" autoFocus required />
          </Form.Group>
          <Form.Group controlId="loginPass">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••" required />
          </Form.Group>
          <Form.Text muted>Prueba FASE-I: usuario <b>Admin</b> | clave <b>1234</b></Form.Text>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>Cancelar</Button>
          <Button type="submit" className="btn-brand">Ingresar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
