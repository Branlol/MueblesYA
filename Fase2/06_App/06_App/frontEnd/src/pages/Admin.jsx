// Panel Admin
import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import CrudTabla from '../components/CrudTabla';
import { api } from '../api/api';

const ESTADOS = ['Confirmado', 'En preparación', 'En camino', 'Entregado'].map((e) => ({ valor: e, etiqueta: e }));

export default function Admin() {
  const [pestana, setPestana] = useState('productos');
  const [op, setOp] = useState({ categorias: [], usuarios: [], productos: [] });
  useEffect(() => {
    Promise.all([api('/admin/categorias'), api('/admin/usuarios'), api('/admin/productos')]).then(([c, u, p]) =>
      setOp({
        categorias: c.map((x) => ({ valor: x.id, etiqueta: x.nombre })),
        usuarios: u.map((x) => ({ valor: x.id, etiqueta: x.usuario })),
        productos: p.map((x) => ({ valor: x.id, etiqueta: x.nombre })),
      })).catch(() => {});
  }, [pestana]);

  return (
    <Container fluid="lg">
      <h1 className="h3 my-4">Administración (CRUD)</h1>
      <Tabs activeKey={pestana} onSelect={setPestana} className="mb-2" mountOnEnter unmountOnExit>
        <Tab eventKey="productos" title="Productos">
          <CrudTabla recurso="productos" singular="producto"
            columnas={[{ key: 'id', label: 'ID' }, { key: 'nombre', label: 'Producto' }, { key: 'categoria', label: 'Categoría' }, { key: 'precio', label: 'Precio', formato: 'moneda' }, { key: 'stock', label: 'Stock' }]}
            campos={[
              { name: 'nombre', label: 'Nombre', requerido: true },
              { name: 'categoria_id', label: 'Categoría', tipo: 'select', opciones: op.categorias, requerido: true },
              { name: 'material', label: 'Material', requerido: true },
              { name: 'precio', label: 'Precio (COP)', tipo: 'number', requerido: true },
              { name: 'stock', label: 'Stock', tipo: 'number', requerido: true },
              { name: 'img', label: 'Imagen', tipo: 'imagen', requerido: true },
              { name: 'detalle', label: 'Detalle', tipo: 'textarea', requerido: true },
            ]} />
        </Tab>
        <Tab eventKey="categorias" title="Categorías">
          <CrudTabla recurso="categorias" singular="categoría"
            columnas={[{ key: 'id', label: 'ID' }, { key: 'slug', label: 'Slug' }, { key: 'nombre', label: 'Nombre' }, { key: 'texto', label: 'Descripción' }]}
            campos={[
              { name: 'slug', label: 'Slug (sin espacios, ej: salas)', requerido: true },
              { name: 'nombre', label: 'Nombre', requerido: true },
              { name: 'texto', label: 'Descripción', tipo: 'textarea', requerido: true },
              { name: 'img', label: 'Imagen', tipo: 'imagen', requerido: true },
            ]} />
        </Tab>
        <Tab eventKey="usuarios" title="Usuarios">
          <CrudTabla recurso="usuarios" singular="usuario"
            columnas={[{ key: 'id', label: 'ID' }, { key: 'usuario', label: 'Usuario' }, { key: 'nombre', label: 'Nombre' }, { key: 'correo', label: 'Correo' }, { key: 'rol', label: 'Rol' }]}
            campos={[
              { name: 'usuario', label: 'Usuario', requerido: true },
              { name: 'nombre', label: 'Nombre completo', requerido: true },
              { name: 'correo', label: 'Correo', tipo: 'email', requerido: true },
              { name: 'rol', label: 'Rol', tipo: 'select', opciones: [{ valor: 'cliente', etiqueta: 'cliente' }, { valor: 'admin', etiqueta: 'admin' }], requerido: true },
              { name: 'clave', label: 'Contraseña', tipo: 'password', requerido: true },
            ]} />
        </Tab>
        <Tab eventKey="pedidos" title="Pedidos">
          <CrudTabla recurso="pedidos" singular="pedido"
            columnas={[{ key: 'id', label: 'ID' }, { key: 'cliente', label: 'Cliente' }, { key: 'producto', label: 'Producto' }, { key: 'cantidad', label: 'Cant.' }, { key: 'total', label: 'Total', formato: 'moneda' }, { key: 'estado', label: 'Estado' }]}
            campos={[
              { name: 'usuario_id', label: 'Cliente', tipo: 'select', opciones: op.usuarios, requerido: true },
              { name: 'producto_id', label: 'Producto', tipo: 'select', opciones: op.productos, requerido: true },
              { name: 'cantidad', label: 'Cantidad', tipo: 'number', requerido: true },
              { name: 'direccion', label: 'Dirección', requerido: true },
              { name: 'estado', label: 'Estado', tipo: 'select', opciones: ESTADOS },
            ]} />
        </Tab>
        <Tab eventKey="mensajes" title="Mensajes">
          <CrudTabla recurso="mensajes" singular="mensaje"
            columnas={[{ key: 'id', label: 'ID' }, { key: 'nombre', label: 'Nombre' }, { key: 'correo', label: 'Correo' }, { key: 'motivo', label: 'Motivo' }, { key: 'mensaje', label: 'Mensaje' }, { key: 'creado', label: 'Fecha', formato: 'fecha' }]}
            campos={[
              { name: 'nombre', label: 'Nombre', requerido: true },
              { name: 'correo', label: 'Correo', tipo: 'email', requerido: true },
              { name: 'motivo', label: 'Motivo', requerido: true },
              { name: 'mensaje', label: 'Mensaje', tipo: 'textarea', requerido: true },
            ]} />
        </Tab>
      </Tabs>
    </Container>
  );
}
