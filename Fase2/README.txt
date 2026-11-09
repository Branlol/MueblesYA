MUEBLESYA - FASE II  (Subgrupo 06)
Node.js + Express + MySQL (XAMPP) + React + asesor de IA (GeminiAI)
ESTRUCTURA
  frontEnd/interfaz React (Vite)            backEnd/API REST, BD, archivos e IA
  Ver el PDF06_MueblesYA

REQUISITOS
  - Node.js 18 o superior (https://nodejs.org)
  - XAMPP con el modulo MySQL (puerto 3306)

PASO A PASO PARA ABRIRLO
  1 Abrir XAMPP y presionar "Start" en MySQL.
      2 Backend:
       cd backEnd
       npm install
       npm start
     La primera vez el programa crea SOLO: la base de datos "mueblesya", el usuario
     un_usr / una_clave, las 7 tablas y los datos de ejemplo. Debe mostrar:
       Base de datos "mueblesya" lista (usuario un_usr).
       MueblesYA listo en http://localhost:3000
     Si el root de XAMPP tiene clave, escribirla en DB_ADMIN_PASSWORD del .env.
     (Alternativa manual en phpMyAdmin > SQL:
        CREATE DATABASE mueblesya CHARACTER SET utf8mb4;
        CREATE USER 'un_usr'@'localhost' IDENTIFIED BY 'una_clave';
        GRANT ALL PRIVILEGES ON mueblesya.* TO 'un_usr'@'localhost'; )
  3 Frontend (otra terminal):
       cd frontEnd
       npm install
       npm run dev          -> abre http://localhost:5173
     (el proxy de Vite envia /api y /public al backend en el puerto 3000)

  MODO SERVIDOR UNICO (sin Vite):
       cd frontEnd && npm run build        (crea frontEnd/dist)
       cd ../backEnd && npm start          -> todo el sitio en http://localhost:3000

USUARIOS DE PRUEBA (usuario | clave)
  Admin   | 1234    // administrador
  Cliente | 1234    // cliente registrado
  BD MySQL: root |   (base: mueblesya)

ASESOR DE IA (GEMINI)
  - La clave se crea en https://aistudio.google.com/apikey y se escribe SOLO en backEnd/.env
  - NUNCA se sube .env a GitHub ni al .zip (ya esta en .gitignore).
  - Sin clave, el asesor funciona en "modo basico" (reglas, sin IA).
  - GEMINI_MODEL permite cambiar de modelo si Google retira el actual.

FUNCIONES PRINCIPALES Y RUTAS DE LA API:
  /api/auth/login|registro    /api/categorias  /api/productos     /api/contacto
  /api/pedidos                /api/archivos    /api/ia/asesor     /api/admin/:recurso (CRUD, admin)
  Contenido estatico (express.static): /public/media, /public/turismo, /public/productos
