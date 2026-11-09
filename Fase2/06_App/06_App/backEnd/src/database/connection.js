import mysql from 'mysql2/promise';
import { config } from '../config/env.js';

let pool = null;

export function abrirPool() {
  pool = mysql.createPool({
    host: config.db.host, port: config.db.port, database: config.db.name,
    user: config.db.user, password: config.db.password,
    waitForConnections: true, connectionLimit: 10,
    decimalNumbers: true, charset: 'utf8mb4',
  });
  return pool;
}

export async function query(sql, params = []) {
  const [filas] = await pool.query(sql, params);
  return filas;
}
