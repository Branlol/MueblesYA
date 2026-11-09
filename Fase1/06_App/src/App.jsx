// Definición de rutas. NavBar y Footer están fuera de <Routes> para que
// la barra de menús permanezca fija en TODAS las páginas.
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import PrivateRoute from './routes/PrivateRoute';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Multimedia from './pages/Multimedia';
import Contacto from './pages/Contacto';
import Panel from './pages/Panel';
import Pedidos from './pages/Pedidos';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      <NavBar />
      <main className="main-content">
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/multimedia" element={<Multimedia />} />
          <Route path="/contacto" element={<Contacto />} />

          {/* RUTAS PRIVADAS: requieren login exitoso */}
          <Route path="/panel" element={<PrivateRoute><Panel /></PrivateRoute>} />
          <Route path="/panel/pedidos" element={<PrivateRoute><Pedidos /></PrivateRoute>} />
          <Route path="/panel/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />

          {/* Cualquier otra URL: página 404 (sin puertas traseras) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
