// Sin sesión redigira al principio y posteriormente abrira el loginn
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, soloAdmin = false }) {
  const { autenticado, esAdmin } = useAuth();
  const location = useLocation();
  if (!autenticado) {
    return <Navigate to="/" replace state={{ requiereLogin: true, desde: location.pathname }} />;
  }
  if (soloAdmin && !esAdmin) return <Navigate to="/panel" replace />;
  return children;
}
