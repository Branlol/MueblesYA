// Datos simulados del catálogo (FASE-I: sin base de datos).
import sala from '../assets/images/sala.svg';
import comedor from '../assets/images/comedor.svg';
import dormitorio from '../assets/images/dormitorio.svg';
import oficina from '../assets/images/oficina.svg';
import exteriores from '../assets/images/exteriores.svg';

export const categorias = [
  { id: 'salas', nombre: 'Salas', img: sala, texto: 'Sofás, butacas y mesas de centro para el espacio de reunión.' },
  { id: 'comedores', nombre: 'Comedores', img: comedor, texto: 'Mesas y sillas en maderas nobles para compartir en familia.' },
  { id: 'dormitorios', nombre: 'Dormitorios', img: dormitorio, texto: 'Camas, closets y mesas de noche para descansar mejor.' },
  { id: 'oficina', nombre: 'Oficina', img: oficina, texto: 'Escritorios y sillas ergonómicas para trabajar desde casa.' },
  { id: 'exteriores', nombre: 'Exteriores', img: exteriores, texto: 'Muebles resistentes al clima para terrazas y jardines.' },
];

export const productos = [
  { id: 1, nombre: 'Sofá Nórdico 3 puestos', categoria: 'salas', material: 'Tela y madera', precio: 1890000, img: sala, detalle: '210 x 90 x 85 cm. Estructura en pino inmunizado.' },
  { id: 2, nombre: 'Comedor Roble 6 sillas', categoria: 'comedores', material: 'Roble', precio: 2450000, img: comedor, detalle: 'Mesa 160 x 90 cm con 6 sillas tapizadas.' },
  { id: 3, nombre: 'Cama Queen con cabecero', categoria: 'dormitorios', material: 'MDF y tela', precio: 1320000, img: dormitorio, detalle: 'Incluye base. Colchón no incluido.' },
  { id: 4, nombre: 'Escritorio Ejecutivo', categoria: 'oficina', material: 'Madera', precio: 780000, img: oficina, detalle: '140 x 60 cm con cajonera lateral.' },
  { id: 5, nombre: 'Mesa de terraza Teca', categoria: 'exteriores', material: 'Teca', precio: 990000, img: exteriores, detalle: 'Tratamiento anti-humedad y rayos UV.' },
  { id: 6, nombre: 'Butaca Reclinable', categoria: 'salas', material: 'Cuero sintético', precio: 650000, img: sala, detalle: 'Mecanismo reclinable manual.' },
];
