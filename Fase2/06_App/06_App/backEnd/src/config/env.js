// env
import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME || 'mueblesya',
    user: process.env.DB_USER || 'root',          
    password: process.env.DB_PASSWORD ?? '', 
    adminUser: process.env.DB_ADMIN_USER || 'root',
    adminPassword: process.env.DB_ADMIN_PASSWORD ?? '',
  },
  jwtSecret: process.env.JWT_SECRET || 'secreto_de_desarrollo_cambiar',
  geminiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
};
