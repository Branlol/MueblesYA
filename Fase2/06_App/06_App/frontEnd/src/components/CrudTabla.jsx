import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { api, fecha, moneda, urlPublica } from '../api/api';

const formatos = { moneda, fecha };

export default function CrudTabla({ recurso, campos, columnas, singular }) {
  const [filas, setFilas] = useState([]);
  const [q, setQ] = useState('');
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(null); // null | {} (nuevo) | fila existente
  const [valores, setValores] = useState({});
  const [errorForm, setErrorForm] = useState('');

  const cargar = () => api(`/admin/${recurso}?q=${encodeURIComponent(q)}`).then((d) => { setFilas(d); setError(''); }).catch((e) => setError(e.message));
  useEffect(() => { const t = setTimeout(cargar, 250); return () => clearTimeout(t); }, [q, recurso]); // eslint-disable-line

  const abrir = (fila) => {
    const v = {};
    campos.forEach((c) => { v[c.name] = c.tipo === 'password' ? '' : (fila?.[c.name] ?? ''); });
    setValores(v); setErrorForm(''); setEditando(fila || {});
  };
  const nuevo = !editando?.id;

  const guardar = async (e) => {
    e.preventDefault(); setErrorForm('');
    try {
      await api(nuevo ? `/admin/${recurso}` : `/admin/${recurso}/${editando.id}`, { metodo: nuevo ? 'POST' : 'PUT', cuerpo: valores });
      setEditando(null); cargar();
    } catch (err) { setErrorForm(err.message); }
  };

  const eliminar = async (fila) => {
    if (!window.confirm(`¿Eliminar este ${singular}? Esta acción no se puede deshacer.`)) return;
    try { await api(`/admin/${recurso}/${fila.id}`, { metodo: 'DELETE' }); cargar(); } catch (err) { setError(err.message); }
  };

  const subirImagen = async (campo, archivo) => {
    if (!archivo) return;
    const fd = new FormData(); fd.append('imagen', archivo);
    try { const { url } = await api('/admin/imagen-producto', { metodo: 'POST', formData: fd }); setValores((v) => ({ ...v, [campo]: url })); }
    catch (err) { setErrorForm(err.message); }
  };

  const control = (c) => {
    const comunes = { required: c.requerido && (nuevo || c.tipo !== 'password'), value: valores[c.name] ?? '', onChange: (e) => setValores({ ...valores, [c.name]: e.target.value }) };
    if (c.tipo === 'select') return (
      <Form.Select {...comunes}><option value="">Selecciona…</option>{c.opciones.map((o) => <option key={o.valor} value={o.valor}>{o.etiqueta}</option>)}</Form.Select>);
    if (c.tipo === 'textarea') return <Form.Control as="textarea" rows={3} {...comunes} />;
    if (c.tipo === 'imagen') return (
      <>
        <Form.Control type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => subirImagen(c.name, e.target.files[0])} />
        {valores[c.name] && <img src={urlPublica(valores[c.name])} alt="Vista previa" className="mt-2 rounded" style={{ maxHeight: 90 }} />}
        <Form.Control className="mt-1" size="sm" {...comunes} placeholder="Ruta de la imagen" />
      </>);
    return <Form.Control type={c.tipo || 'text'} min={c.tipo === 'number' ? 0 : undefined} {...comunes} placeholder={c.tipo === 'password' && !nuevo ? 'Dejar vacío para no cambiar' : ''} />;
  };

  return (
    <>
      <div className="d-flex flex-wrap gap-2 my-3">
        <Form.Control type="search" placeholder={`Buscar ${singular}…`} aria-label={`Buscar ${singular}`} value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 320 }} />
        <Button className="btn-brand" onClick={() => abrir(null)}>+ Nuevo {singular}</Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table responsive striped hover size="sm">
        <thead><tr>{columnas.map((c) => <th key={c.key}>{c.label}</th>)}<th></th></tr></thead>
        <tbody>
          {filas.length === 0 && <tr><td colSpan={columnas.length + 1} className="text-center text-muted">Sin registros.</td></tr>}
          {filas.map((f) => (
            <tr key={f.id}>
              {columnas.map((c) => <td key={c.key} className="text-break">{c.formato ? formatos[c.formato](f[c.key]) : String(f[c.key] ?? '')}</td>)}
              <td className="text-nowrap">
                <Button size="sm" variant="outline-secondary" className="me-1" onClick={() => abrir(f)}>Editar</Button>
                <Button size="sm" variant="outline-danger" onClick={() => eliminar(f)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={!!editando} onHide={() => setEditando(null)} centered>
        <Form onSubmit={guardar}>
          <Modal.Header closeButton><Modal.Title className="h5">{nuevo ? 'Nuevo' : 'Editar'} {singular}</Modal.Title></Modal.Header>
          <Modal.Body>
            {errorForm && <Alert variant="danger">{errorForm}</Alert>}
            {campos.map((c) => (
              <Form.Group className="mb-2" key={c.name} controlId={`f-${recurso}-${c.name}`}>
                <Form.Label>{c.label}</Form.Label>
                {control(c)}
              </Form.Group>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setEditando(null)}>Cancelar</Button>
            <Button type="submit" className="btn-brand">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
