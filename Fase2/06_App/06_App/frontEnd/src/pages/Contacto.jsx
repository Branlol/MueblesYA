//Formulario hecho con react y bootstrap, queda en la sesion de mensajes
import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { api } from '../api/api';

export default function Contacto() {
  const [validado, setValidado] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setValidado(true);
    if (!form.checkValidity()) return;
    setError('');
    try {
      await api('/contacto', { metodo: 'POST', cuerpo: {
        nombre: form.cNombre.value, correo: form.cCorreo.value, motivo: form.cMotivo.value, mensaje: form.cMensaje.value,
      } });
      setEnviado(true); form.reset(); setValidado(false);
    } catch (err) { setError(err.message); }
  };

  return (
    <Container style={{ maxWidth: 640 }}>
      <h1 className="h3 my-4">Contáctanos</h1>
      {enviado && <Alert variant="success" dismissible onClose={() => setEnviado(false)}>¡Mensaje enviado! Te responderemos pronto.</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form noValidate validated={validado} onSubmit={enviar}>
        <Form.Group className="mb-3" controlId="cNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control required minLength={3} placeholder="Tu nombre" />
          <Form.Control.Feedback type="invalid">Ingresa tu nombre (mínimo 3 caracteres).</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="cCorreo">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control type="email" required placeholder="nombre@correo.com" />
          <Form.Control.Feedback type="invalid">Ingresa un correo válido.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="cMotivo">
          <Form.Label>Motivo</Form.Label>
          <Form.Select required defaultValue="">
            <option value="" disabled>Selecciona…</option>
            <option>Consulta de producto</option>
            <option>Estado de un pedido</option>
            <option>Garantías y devoluciones</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">Selecciona un motivo.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="cMensaje">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control as="textarea" rows={4} required minLength={10} />
          <Form.Control.Feedback type="invalid">Escribe al menos 10 caracteres.</Form.Control.Feedback>
        </Form.Group>
        <Form.Check className="mb-3" type="checkbox" id="cAcepto" label="Acepto el tratamiento de mis datos" required feedback="Debes aceptar para continuar." feedbackType="invalid" />
        <Button type="submit" className="btn-brand">Enviar</Button>
      </Form>
    </Container>
  );
}
