// Asesor con IA. La API KEY está en el .env del Backend
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import PedidoModal from '../components/PedidoModal';
import { api, moneda, urlPublica } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useCategorias } from '../api/useCategorias';

const MASCOTAS = ['Ninguna', 'Perro pequeño', 'Perro grande', 'Gato', 'Perro y gato', 'Otra'];

export default function Asesor() {
  const { autenticado } = useAuth();
  const categorias = useCategorias();
  const [form, setForm] = useState({ personas: 2, mascotas: 'Ninguna', presupuesto: '', ambiente: '', descripcion: '' });
  const [foto, setFoto] = useState(null);
  const [vista, setVista] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [res, setRes] = useState(null);
  const [pedir, setPedir] = useState(null); // { producto, cantidad }
  const [historial, setHistorial] = useState([]);

  const cargarHistorial = () => autenticado && api('/ia/historial').then(setHistorial).catch(() => {});
  useEffect(() => { cargarHistorial(); }, [autenticado]); // eslint-disable-line

  const cambiar = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const elegirFoto = (e) => {
    const f = e.target.files[0];
    if (vista) URL.revokeObjectURL(vista);
    setFoto(f || null); setVista(f ? URL.createObjectURL(f) : '');
  };

  const consultar = async (e) => {
    e.preventDefault(); setError(''); setRes(null); setCargando(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (foto) fd.append('foto', foto);
    try { setRes(await api('/ia/asesor', { metodo: 'POST', formData: fd })); cargarHistorial(); }
    catch (err) { setError(err.message); }
    setCargando(false);
  };

  return (
    <Container fluid="lg">
      <h1 className="h3 my-4">Asesor IA <Badge bg="warning" text="dark">Gemini</Badge></h1>
      <p>Cuéntanos cómo es tu espacio y quién lo usa. Por ejemplo: «sala para 5 personas con un perro grande que se sube al sofá».</p>
      <Row className="g-4">
        <Col lg={5}>
          <Form onSubmit={consultar}>
            <Row className="g-2">
              <Col xs={6}><Form.Group controlId="aPersonas"><Form.Label>Personas</Form.Label><Form.Control type="number" min={1} max={30} value={form.personas} onChange={cambiar('personas')} required /></Form.Group></Col>
              <Col xs={6}><Form.Group controlId="aMascotas"><Form.Label>Mascotas</Form.Label>
                <Form.Select value={form.mascotas} onChange={cambiar('mascotas')}>{MASCOTAS.map((m) => <option key={m}>{m}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={6}><Form.Group controlId="aPresupuesto"><Form.Label>Presupuesto (COP)</Form.Label><Form.Control type="number" min={0} step={50000} value={form.presupuesto} onChange={cambiar('presupuesto')} placeholder="Opcional" /></Form.Group></Col>
              <Col xs={6}><Form.Group controlId="aAmbiente"><Form.Label>Ambiente</Form.Label>
                <Form.Select value={form.ambiente} onChange={cambiar('ambiente')}><option value="">Cualquiera</option>{categorias.map((c) => <option key={c.id} value={c.slug}>{c.nombre}</option>)}</Form.Select></Form.Group></Col>
              <Col xs={12}><Form.Group controlId="aDescripcion"><Form.Label>Descripción</Form.Label>
                <Form.Control as="textarea" rows={3} maxLength={800} value={form.descripcion} onChange={cambiar('descripcion')} placeholder="Ej: mi perro se sube al sofá, necesito algo fácil de limpiar." /></Form.Group></Col>
              <Col xs={12}><Form.Group controlId="aFoto"><Form.Label>Foto de tu espacio o de tu mascota (opcional, máx. 4 MB)</Form.Label>
                <Form.Control type="file" accept="image/jpeg,image/png,image/webp" onChange={elegirFoto} /></Form.Group>
                {vista && <img src={vista} alt="Vista previa de la foto" className="img-fluid rounded mt-2" style={{ maxHeight: 160 }} />}</Col>
            </Row>
            <Button type="submit" className="btn-brand mt-3" disabled={cargando}>{cargando ? 'Consultando…' : 'Pedir recomendación'}</Button>
          </Form>
          {historial.length > 0 && (
            <div className="mt-4"><h2 className="h6">Tus últimas consultas</h2>
              <ul className="small ps-3">{historial.map((h) => <li key={h.id}>{h.pregunta.descripcion || h.pregunta.ambiente || 'Consulta con foto'} <span className="text-muted">({h.modo})</span></li>)}</ul></div>
          )}
        </Col>

        <Col lg={7} aria-live="polite">
          {cargando && <div className="text-center py-5"><Spinner animation="border" role="status" /><p className="mt-2">El asesor está pensando…</p></div>}
          {error && <Alert variant="danger">{error}</Alert>}
          {res && (
            <>
              {res.modo === 'basico' && <Alert variant="info" className="small">Respuesta en modo básico (sin IA): el servicio de Gemini no está disponible o no tiene clave configurada.</Alert>}
              <Card body className="mb-3 card-ia"><p className="mb-0">{res.resumen}</p>
                {res.analisis_foto && <p className="small mt-2 mb-0"><b>Sobre tu foto:</b> {res.analisis_foto}</p>}</Card>
              {res.recomendaciones.length === 0 && <p>No encontramos productos adecuados; intenta describir otra necesidad.</p>}
              <Row xs={1} md={2} className="g-3">
                {res.recomendaciones.map((r) => (
                  <Col key={r.producto_id}>
                    <Card className="h-100 product-card">
                      <Card.Img variant="top" src={urlPublica(r.producto.img)} alt={r.producto.nombre} />
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="h6">{r.producto.nombre}</Card.Title>
                        <Card.Text className="fw-bold mb-1">{moneda(r.producto.precio)}</Card.Text>
                        <Card.Text className="small">{r.motivo}</Card.Text>
                        <Button size="sm" className="btn-brand mt-auto" disabled={r.producto.stock < 1} onClick={() => setPedir({ producto: r.producto, cantidad: r.cantidad_sugerida })}>Pedir {r.cantidad_sugerida > 1 ? `(${r.cantidad_sugerida})` : ''}</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              {res.consejos.length > 0 && <><h2 className="h6 mt-3">Consejos</h2><ul className="small">{res.consejos.map((c) => <li key={c}>{c}</li>)}</ul></>}
            </>
          )}
        </Col>
      </Row>
      {pedir && <PedidoModal producto={pedir.producto} cantidadInicial={pedir.cantidad} onHide={() => setPedir(null)} />}
    </Container>
  );
}
