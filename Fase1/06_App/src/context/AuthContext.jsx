// Contexto de autenticación SIMULADA (FASE-I).
// El usuario y la clave están "quemados" en el código: Admin | 1234.
// En la FASE-II se reemplazará por una llamada a la API (Node/Express + MySQL).
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const USUARIO_VALIDO = 'Admin';
const CLAVE_VALIDA = '1234';

export function AuthProvider({ children }) {
  // sessionStorage: la sesión se cierra al cerrar la pestaña
  const [usuario, setUsuario] = useState(() => sessionStorage.getItem('usuario'));

  const login = (user, pass) => {
    if (user === USUARIO_VALIDO && pass === CLAVE_VALIDA) {
      sessionStorage.setItem('usuario', user);
      setUsuario(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, autenticado: !!usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
