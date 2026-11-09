import { useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import { api, descargarArchivo, fecha } from '../api/api';
import { useAuth } from '../context/AuthContext';

const tamano = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.ceil(b / 1024)} KB`);

export default function Archivos() {
  const { esAdmin } = useAuth();
  const [lista, setLista] = useState([]);
  const [publico, setPublico] = useState(false);
  const [msg, setMsg] = useState(null); // { tipo, texto }
  const [subiendo, setSubiendo] = useState(false);
  const input = useRef(null);

  const cargar = () => api('/archivos').then(setLista).catch((e) => setMsg({ tipo: 'danger', texto: e.message }));
  useEffect(() => { cargar(); }, []);

  const subir = async (e) => {
    e.preventDefault();
    const archivo = input.current.files[0];
    if (!archivo) return setMsg({ tipo: 'warning', texto: 'Selecciona un archivo.' });
    const fd = new FormData();
    fd.append('archivo', archivo);
    fd.append('publico', publico ? '1' : '0');
    setSubiendo(true);
    try { await api('/archivos', { metodo: 'POST', formData: fd }); setMsg({ tipo: 'success', texto: 'Archivo subido.' }); input.current.value = ''; cargar(); }
    catch (err) { setMsg({ tipo: 'danger', texto: err.message }); }
    setSubiendo(false);
  };

  const bajar = (a) => descargarArchivo(a.id, a.nombre_original).catch((e) => setMsg({ tipo: 'danger', texto: e.message }));
  const borrar = async (a) => {
    if (!window.confirm(`¿Eliminar "${a.nombre_original}"?`)) return;
    try { await api(`/archivos/${a.id}`, { metodo: 'DELETE' }); cargar(); } catch (e) { setMsg({ tipo: 'danger', texto: e.message }); }
  };

  return (
    <Container fluid="lg">
      <h1 className="h3 my-4">Mis archivos</h1>
      {msg && <Alert variant={msg.tipo} dismissible onClose={() => setMsg(null)}>{msg.texto}</Alert>}
      <Form onSubmit={subir} className="row g-2 align-items-end mb-4">
        <Form.Group className="col-md-6" controlId="fArchivo">
          <Form.Label>Archivo (máx. 25 MB; texto, imagen, video, PDF…)</Form.Label>
          <Form.Control type="file" ref={input} />
        </Form.Group>
        <div className="col-md-3"><Form.Check id="fPublico" label="Mostrar en Multimedia (público)" checked={publico} onChange={(e) => setPublico(e.target.checked)} /></div>
        <div className="col-md-3"><Button type="submit" className="btn-brand w-100" disabled={subiendo}>{subiendo ? 'Subiendo…' : 'Subir al servidor'}</Button></div>
      </Form>
      <Table responsive striped hover>
        <thead><tr><th>Nombre</th>{esAdmin && <th>Propietario</th>}<th>Tipo</th><th>Tamaño</th><th>Fecha</th><th>Visibilidad</th><th></th></tr></thead>
        <tbody>
          {lista.length === 0 && <tr><td colSpan={7} className="text-center text-muted">Sin archivos todavía.</td></tr>}
          {lista.map((a) => (
            <tr key={a.id}>
              <td className="text-break">{a.nombre_original}</td>{esAdmin && <td>{a.propietario}</td>}
              <td>{a.mime}</td><td>{tamano(a.tamano)}</td><td>{fecha(a.creado)}</td>
              <td><Badge bg={a.publico ? 'success' : 'secondary'}>{a.publico ? 'Público' : 'Privado'}</Badge></td>
              <td className="text-nowrap">
                <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => bajar(a)}>Descargar</Button>
                <Button size="sm" variant="outline-danger" onClick={() => borrar(a)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
