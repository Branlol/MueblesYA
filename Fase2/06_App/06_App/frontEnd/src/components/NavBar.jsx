// Barra de menús FIJA, ITEM administración sólo visible para  el rol admin
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { useAuth } from '../context/AuthContext';
import LoginModal from './LoginModal';
import logo from '../assets/images/logo.svg';
import { useCategorias } from '../api/useCategorias';

// Efecto POPOVER
const ayuda = (
  <Popover id="popover-ayuda">
    <Popover.Header as="h3">¿Necesitas ayuda?</Popover.Header>
    <Popover.Body>
      Escríbenos desde <b>Contacto</b>. Para ver las secciones privadas inicia sesión (<b>Cliente | 1234</b> o <b>Admin | 1234</b>) o crea tu cuenta.
    </Popover.Body>
  </Popover>
);

export default function NavBar() {
  const { autenticado, nombre, esAdmin, logout, loginVisible, abrirLogin, cerrarLogin } = useAuth();
  const categorias = useCategorias();
  const navigate = useNavigate();
  const location = useLocation();

  // Login por no autenticación previa, e intento de acceso a zona no autorizada
  const abrirPorRedireccion = location.state?.requiereLogin && !autenticado;

  const salir = () => { logout(); navigate('/'); };

  return (
    <>
      <Navbar expand="xl" fixed="top" variant="dark" className="navbar-brand-bar" collapseOnSelect>
        <Container fluid="lg">
          <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center gap-2">
            <img src={logo} alt="Logo MueblesYA" width="36" height="36" />
            <span className="fw-bold">MueblesYA</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="menu-principal" />
          <Navbar.Collapse id="menu-principal">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
              <NavDropdown title="Categorías" id="dropdown-categorias">
                {categorias.map((c) => (
                  <NavDropdown.Item key={c.id} as={NavLink} to={`/catalogo?cat=${c.slug}`}>{c.nombre}</NavDropdown.Item>
                ))}
                <NavDropdown.Divider />
                <NavDropdown.Item as={NavLink} to="/catalogo">Ver todo el catálogo</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={NavLink} to="/asesor">Asesor IA</Nav.Link>
              <Nav.Link as={NavLink} to="/bucaramanga">Bucaramanga</Nav.Link>
              <Nav.Link as={NavLink} to="/multimedia">Multimedia</Nav.Link>
              <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>

              {/* Menú de RUTAS PRIVADAS*/}
              {autenticado && (
                <NavDropdown title="Mi panel" id="dropdown-privado">
                  <NavDropdown.Item as={NavLink} to="/panel">Resumen</NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/panel/pedidos">Seguimiento de pedidos</NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/panel/archivos">Mis archivos</NavDropdown.Item>
                  {esAdmin && <NavDropdown.Item as={NavLink} to="/panel/admin">Administración</NavDropdown.Item>}
                </NavDropdown>
              )}
            </Nav>
            <div className="d-flex align-items-center gap-2">
              <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={ayuda}>
                <Button variant="outline-light" size="sm" aria-label="Ayuda">?</Button>
              </OverlayTrigger>
              {autenticado ? (
                <>
                  <span className="text-light small">Hola, {nombre}</span>
                  <Button variant="light" size="sm" onClick={salir}>Salir</Button>
                </>
              ) : (
                <Button variant="light" size="sm" onClick={abrirLogin}>Ingresar</Button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <LoginModal show={loginVisible || abrirPorRedireccion} onHide={() => { cerrarLogin(); if (abrirPorRedireccion) navigate('/', { replace: true, state: null }); }} />
    </>
  );
}
