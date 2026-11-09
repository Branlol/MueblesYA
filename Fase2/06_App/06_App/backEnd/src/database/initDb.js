import mysql from 'mysql2/promise';
import { config } from '../config/env.js';
import { abrirPool, query } from './connection.js';
import { hashClave } from '../utils/security.js';

const { db } = config;

async function asegurarBaseYUsuario() {
  try {
    const c = await mysql.createConnection({ host: db.host, port: db.port, user: db.user, password: db.password, database: db.name });
    await c.end();
    return;
  } catch (e) {
    if (!['ER_ACCESS_DENIED_ERROR', 'ER_BAD_DB_ERROR', 'ER_DBACCESS_DENIED_ERROR'].includes(e.code)) throw e;
  }
  
  const admin = await mysql.createConnection({ host: db.host, port: db.port, user: db.adminUser, password: db.adminPassword });
  try {
    await admin.query(`CREATE DATABASE IF NOT EXISTS \`${db.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await admin.query('CREATE USER IF NOT EXISTS ?@? IDENTIFIED BY ?', [db.user, '%', db.password]);
    await admin.query('CREATE USER IF NOT EXISTS ?@? IDENTIFIED BY ?', [db.user, 'localhost', db.password]);
    await admin.query(`GRANT ALL PRIVILEGES ON \`${db.name}\`.* TO ?@?`, [db.user, '%']);
    await admin.query(`GRANT ALL PRIVILEGES ON \`${db.name}\`.* TO ?@?`, [db.user, 'localhost']);
    await admin.query('FLUSH PRIVILEGES');
  } finally { await admin.end(); }
}

const TABLAS = [
  `CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(80) NOT NULL,
    correo VARCHAR(120) NOT NULL UNIQUE,
    clave_hash VARCHAR(255) NOT NULL,
    rol ENUM('admin','cliente') NOT NULL DEFAULT 'cliente',
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(30) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    texto VARCHAR(200) NOT NULL,
    img VARCHAR(200) NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria_id INT NOT NULL,
    material VARCHAR(60) NOT NULL,
    precio DECIMAL(12,0) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    img VARCHAR(200) NOT NULL,
    detalle VARCHAR(300) NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
  )`,
  `CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    total DECIMAL(14,0) NOT NULL,
    direccion VARCHAR(150) NOT NULL,
    estado ENUM('Confirmado','En preparación','En camino','Entregado') NOT NULL DEFAULT 'Confirmado',
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
  )`,
  `CREATE TABLE IF NOT EXISTS mensajes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    correo VARCHAR(120) NOT NULL,
    motivo VARCHAR(60) NOT NULL,
    mensaje TEXT NOT NULL,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS archivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nombre_original VARCHAR(200) NOT NULL,
    nombre_servidor VARCHAR(80) NOT NULL,
    mime VARCHAR(100) NOT NULL,
    tamano INT NOT NULL,
    publico TINYINT(1) NOT NULL DEFAULT 0,
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS consultas_ia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    pregunta TEXT NOT NULL,
    respuesta MEDIUMTEXT NOT NULL,
    modo VARCHAR(10) NOT NULL DEFAULT 'ia',
    creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
  )`,
];

// Datos iniciales
const P = '/public/productos';
const CATEGORIAS = [
  ['salas', 'Salas', 'Sofás, butacas y mesas de centro para el espacio de reunión.', `${P}/sala.svg`],
  ['comedores', 'Comedores', 'Mesas y sillas en maderas nobles para compartir en familia.', `${P}/comedor.svg`],
  ['dormitorios', 'Dormitorios', 'Camas, closets y mesas de noche para descansar mejor.', `${P}/dormitorio.svg`],
  ['oficina', 'Oficina', 'Escritorios y sillas ergonómicas para trabajar desde casa.', `${P}/oficina.svg`],
  ['exteriores', 'Exteriores', 'Muebles resistentes al clima para terrazas y jardines.', `${P}/exteriores.svg`],
];
// (nombre, slug categoria, material, precio, stock, imagen, detalle)
const PRODUCTOS = [
  ['Sofá Nórdico 3 puestos', 'salas', 'Tela y madera', 1890000, 8, 'sala', '210 x 90 x 85 cm. Estructura en pino inmunizado.'],
  ['Comedor Roble 6 sillas', 'comedores', 'Roble', 2450000, 5, 'comedor', 'Mesa 160 x 90 cm con 6 sillas tapizadas.'],
  ['Cama Queen con cabecero', 'dormitorios', 'MDF y tela', 1320000, 10, 'dormitorio', 'Incluye base. Colchón no incluido.'],
  ['Escritorio Ejecutivo', 'oficina', 'Madera', 780000, 12, 'oficina', '140 x 60 cm con cajonera lateral.'],
  ['Mesa de terraza Teca', 'exteriores', 'Teca', 990000, 6, 'exteriores', 'Tratamiento anti-humedad y rayos UV.'],
  ['Butaca Reclinable', 'salas', 'Cuero sintético', 650000, 15, 'sala', 'Mecanismo reclinable manual.'],
];

async function sembrar() {
  const [{ n }] = await query('SELECT COUNT(*) AS n FROM usuarios');
  if (n > 0) return; // ya hay datos: no se repite la siembra

  // Usuarios de prueba// Admin | 1234  y  Cliente | 1234
  await query('INSERT INTO usuarios (usuario, nombre, correo, clave_hash, rol) VALUES ?', [[
    ['Admin', 'Administrador MueblesYA', 'admin@mueblesya.com', hashClave('1234'), 'admin'],
    ['Cliente', 'Cliente de Prueba', 'cliente@mueblesya.com', hashClave('1234'), 'cliente'],
  ]]);
  await query('INSERT INTO categorias (slug, nombre, texto, img) VALUES ?', [CATEGORIAS]);
  const cats = await query('SELECT id, slug FROM categorias');
  const idCat = Object.fromEntries(cats.map((c) => [c.slug, c.id]));
  await query('INSERT INTO productos (nombre, categoria_id, material, precio, stock, img, detalle) VALUES ?',
    [PRODUCTOS.map(([nom, cat, mat, pre, stk, img, det]) => [nom, idCat[cat], mat, pre, stk, `${P}/${img}.svg`, det])]);
  //Pedidos q se agregan de ejemplo
  const [{ id: uid }] = await query("SELECT id FROM usuarios WHERE usuario = 'Cliente'");
  const prods = await query('SELECT id, nombre, precio FROM productos');
  const por = (nom) => prods.find((p) => p.nombre.startsWith(nom));
  const ejemplo = [['Sofá', 'En camino'], ['Escritorio', 'Entregado'], ['Cama', 'En preparación'], ['Mesa de terraza', 'Confirmado']];
  await query('INSERT INTO pedidos (usuario_id, producto_id, cantidad, total, direccion, estado) VALUES ?',
    [ejemplo.map(([nom, est]) => [uid, por(nom).id, 1, por(nom).precio, 'Cra 27 # 18-30, Bucaramanga', est])]);
}

export async function prepararBaseDeDatos() {
  await asegurarBaseYUsuario();
  abrirPool();
  for (const sql of TABLAS) await query(sql);
  await sembrar();
  console.log(`Base de datos "${db.name}" lista (usuario ${db.user}).`);
}
