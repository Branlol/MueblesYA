// Rutas publicas y privada
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
import Archivos from './pages/Archivos';
import Asesor from './pages/Asesor';
import Bucaramanga from './pages/Bucaramanga';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      <NavBar />
      <main className="main-content">
        <Routes>
          {/* Public routes, cualquiera puede acceder a estas */}
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/asesor" element={<Asesor />} />
          <Route path="/bucaramanga" element={<Bucaramanga />} />
          <Route path="/multimedia" element={<Multimedia />} />
          <Route path="/contacto" element={<Contacto />} />

          {/* Private routes, requieren estár logueado*/}
          <Route path="/panel" element={<PrivateRoute><Panel /></PrivateRoute>} />
          <Route path="/panel/pedidos" element={<PrivateRoute><Pedidos /></PrivateRoute>} />
          <Route path="/panel/archivos" element={<PrivateRoute><Archivos /></PrivateRoute>} />
          {/*Panel para admins */}
          <Route path="/panel/admin" element={<PrivateRoute soloAdmin><Admin /></PrivateRoute>} />

          {/* Para los Errores*/}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
