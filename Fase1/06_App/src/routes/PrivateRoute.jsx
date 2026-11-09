// Guardián de rutas privadas: si no hay sesión, redirige al inicio
// y abre el modal de login. Evita el acceso por "puertas traseras" (URL directa).
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { autenticado } = useAuth();
  const location = useLocation();
  if (!autenticado) {
    return <Navigate to="/" replace state={{ requiereLogin: true, desde: location.pathname }} />;
  }
  return children;
}
