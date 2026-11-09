// Modal de BS para login o crear acc
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ show, onHide }) {
  const { login, registrar } = useAuth();
  const navigate = useNavigate();
  const [pestana, setPestana] = useState('login');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [reg, setReg] = useState({ usuario: '', nombre: '', correo: '', clave: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const terminar = () => { setError(''); setUser(''); setPass(''); setReg({ usuario: '', nombre: '', correo: '', clave: '' }); onHide(); navigate('/panel'); };

  const enviarLogin = async (e) => {
    e.preventDefault(); setCargando(true);
    const r = await login(user.trim(), pass);
    setCargando(false);
    r.ok ? terminar() : setError(r.error);
  };

  const enviarRegistro = async (e) => {
    e.preventDefault(); setCargando(true);
    const r = await registrar(reg);
    setCargando(false);
    r.ok ? terminar() : setError(r.error);
  };

  const campoReg = (k) => ({ value: reg[k], onChange: (e) => setReg({ ...reg, [k]: e.target.value }), required: true });

  return (
    <Modal show={show} onHide={onHide} centered aria-labelledby="titulo-login">
      <Modal.Header closeButton><Modal.Title id="titulo-login">Acceso a MueblesYA</Modal.Title></Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Tabs activeKey={pestana} onSelect={(k) => { setPestana(k); setError(''); }} className="mb-3" fill>
          <Tab eventKey="login" title="Iniciar sesión">
            <Form onSubmit={enviarLogin}>
              <Form.Group className="mb-3" controlId="loginUser">
                <Form.Label>Usuario</Form.Label>
                <Form.Control value={user} onChange={(e) => setUser(e.target.value)} placeholder="Cliente" autoFocus required />
              </Form.Group>
              <Form.Group className="mb-2" controlId="loginPass">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••" required />
              </Form.Group>
              <Form.Text muted>Pruebas: <b>Admin | 1234</b> (administrador) o <b>Cliente | 1234</b>.</Form.Text>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="outline-secondary" onClick={onHide}>Cancelar</Button>
                <Button type="submit" className="btn-brand" disabled={cargando}>{cargando ? 'Verificando…' : 'Ingresar'}</Button>
              </div>
            </Form>
          </Tab>
          <Tab eventKey="registro" title="Crear cuenta">
            <Form onSubmit={enviarRegistro}>
              <Form.Group className="mb-2" controlId="regUsuario"><Form.Label>Usuario</Form.Label><Form.Control {...campoReg('usuario')} minLength={3} maxLength={30} /></Form.Group>
              <Form.Group className="mb-2" controlId="regNombre"><Form.Label>Nombre completo</Form.Label><Form.Control {...campoReg('nombre')} maxLength={80} /></Form.Group>
              <Form.Group className="mb-2" controlId="regCorreo"><Form.Label>Correo</Form.Label><Form.Control type="email" {...campoReg('correo')} /></Form.Group>
              <Form.Group className="mb-2" controlId="regClave"><Form.Label>Contraseña (mínimo 4)</Form.Label><Form.Control type="password" minLength={4} {...campoReg('clave')} /></Form.Group>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button variant="outline-secondary" onClick={onHide}>Cancelar</Button>
                <Button type="submit" className="btn-brand" disabled={cargando}>{cargando ? 'Creando…' : 'Registrarme'}</Button>
              </div>
            </Form>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
}
