=====================================================================
 MUEBLESYA - FASE I (Frontend React)  |  Programacion Web - UIS
 Paso a paso para ejecutar el aplicativo en un computador local
 o publicarlo en un servidor
=====================================================================

REQUISITOS PREVIOS
  - Node.js 18 o superior (https://nodejs.org)  -> verificar con:  node -v
  - npm (se instala junto con Node.js)          -> verificar con:  npm -v
  - Conexion a internet (solo para descargar dependencias la primera vez)
  - Un navegador moderno (Chrome, Edge, Firefox)

NOTA: la carpeta se entrega SIN "node_modules". Se regenera con npm install.

A) EJECUTAR EN UN COMPUTADOR LOCAL (modo desarrollo)
  1. Descomprima el .zip y abra una terminal (CMD, PowerShell o Terminal).
  2. Entre a la carpeta del aplicativo:
         cd 06_App
  3. Instale las dependencias (React, React-Bootstrap, React Router, Vite):
         npm install
  4. Inicie el servidor de desarrollo:
         npm run dev
  5. Abra en el navegador la direccion que muestra la terminal
     (normalmente http://localhost:5173).
  6. Para detenerlo, presione Ctrl + C en la terminal.

B) PROBAR EL LOGIN SIMULADO (rutas privadas)
  1. Pulse "Ingresar" en la barra de menu superior.
  2. Usuario: Admin      Contrasena: 1234
  3. Al validar aparece el menu "Mi panel" (rutas privadas).
  4. Sin sesion, escribir en la URL /panel, /panel/pedidos o /panel/admin
     redirige al inicio y abre el login.

C) GENERAR LA VERSION DE PRODUCCION
  1. Dentro de 06_App ejecute:
         npm run build
     Se crea la carpeta "dist" con el sitio listo para publicar.
  2. Para revisarla localmente:
         npm run preview

D) PUBLICAR EN UN SERVIDOR
  Opcion 1 - Servidor propio (Apache / Nginx):
     1. Copie el contenido de la carpeta "dist" a la carpeta publica
        del servidor (ej. /var/www/html).
     2. IMPORTANTE (React Router): configure que cualquier ruta devuelva
        index.html.
        Nginx:   location / { try_files $uri /index.html; }
        Apache:  habilite mod_rewrite y redirija a /index.html
                 cuando el archivo solicitado no exista.
  Opcion 2 - Hosting estatico (Vercel / Netlify / Render Static Site):
     1. Suba el proyecto a GitHub.
     2. Importe el repositorio en la plataforma.
     3. Comando de build: npm run build   |  Directorio de salida: dist
     4. Active la regla "todas las rutas -> /index.html".

ESTRUCTURA RESUMIDA
  06_App/
    index.html            Documento base
    package.json          Dependencias y scripts
    vite.config.js        Configuracion de Vite
    public/               Archivos estaticos (favicon)
    src/
      main.jsx, App.jsx   Arranque y definicion de rutas
      components/         NavBar, Footer, LoginModal, HeroCarousel, ProductCard
      pages/              Paginas publicas y privadas
      context/            AuthContext (login simulado)
      routes/             PrivateRoute (proteccion de rutas)
      data/               Productos y equipo (datos simulados)
      styles/             Hojas de estilo (main.css)
      assets/             images/  audio/  video/

SOLUCION DE PROBLEMAS
  - "npm no se reconoce": instale Node.js y reinicie la terminal.
  - Puerto ocupado: Vite elegira otro puerto; use el que indique la terminal.
  - Pagina en blanco al recargar en el servidor: falta la regla de
    redireccion a index.html (ver seccion D).

Integrantes: Nicolas Soto Sanchez, Brandon Andres Jaimes Romero,
             Nicolas David Sanguino Ortiz, Juan Sebastian Araujo Contreras
