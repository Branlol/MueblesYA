// Pie de pagina, con contacto, redes sociales que no llevan a nada, y los 3 integrantes
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { equipo } from '../data/team';

const redes = [
  { nombre: 'Facebook', url: 'https://www.facebook.com/' },
  { nombre: 'Twitter / X', url: 'https://x.com/' },
  { nombre: 'Instagram', url: 'https://www.instagram.com/' },
  { nombre: 'YouTube', url: 'https://www.youtube.com/' },
];

export default function Footer() {
  const [miembro, setMiembro] = useState(null); // integrante que se selecciono parae el modal

  return (
    <footer className="site-footer mt-5 pt-4 pb-3">
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <h5>Contáctenos</h5>
            <p className="mb-1">Bucaramanga, Santander, Colombia</p>
            <p className="mb-1">Tel: +57 300 000 0000</p>
            <p className="mb-1">contacto@mueblesya.com</p>
            <p className="small mb-0">Políticas de envío: despacho a domicilio calculado por zona.</p>
          </Col>
          <Col md={4}>
            <h5>Nuestro equipo</h5>
            <ul className="list-unstyled mb-0">
              {equipo.map((m) => (
                <li key={m.nombre}>
                  <Button variant="link" className="footer-link p-0" onClick={() => setMiembro(m)}>{m.nombre}</Button>
                </li>
              ))}
            </ul>
          </Col>
          <Col md={4}>
            <h5>Síguenos</h5>
            <ul className="list-unstyled mb-0">
              {redes.map((r) => (
                <li key={r.nombre}><a className="footer-link" href={r.url} target="_blank" rel="noreferrer">{r.nombre}</a></li>
              ))}
            </ul>
          </Col>
        </Row>
        <hr />
        <p className="text-center small mb-0">© 2026 MueblesYA · Universidad Industrial de Santander · Programación Web</p>
      </Container>

      {/* Modal con datos básicos del estudiante + foto */}
      <Modal show={!!miembro} onHide={() => setMiembro(null)} centered>
        {miembro && (
          <>
            <Modal.Header closeButton><Modal.Title>{miembro.nombre}</Modal.Title></Modal.Header>
            <Modal.Body className="text-center">
              <p className="mb-1"><b>Rol Scrum:</b> {miembro.rol}</p>
              <p className="mb-1"><b>Programa:</b> {miembro.carrera}</p>
              <p className="mb-1"><b>Código:</b> {miembro.codigo}</p>
              <p className="mb-0"><b>Correo:</b> {miembro.correo}</p>
            </Modal.Body>
          </>
        )}
      </Modal>
    </footer>
  );
}
