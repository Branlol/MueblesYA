/* Guardamos el token y datos del usuario en sessionStorage, entre otras cosas de autenticación*/
import { createContext, useContext, useState } from 'react';
import { api } from '../api/api';

const AuthContext = createContext(null);

const leerUsuario = () => {
  try { return JSON.parse(sessionStorage.getItem('usuario')); } catch { return null; }
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuario);
  const [loginVisible, setLoginVisible] = useState(false);

  const guardarSesion = ({ token, usuario: u }) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('usuario', JSON.stringify(u));
    setUsuario(u);
  };

  // Devuelve { ok, error }
  const login = async (user, clave) => {
    try { guardarSesion(await api('/auth/login', { metodo: 'POST', cuerpo: { usuario: user, clave } })); return { ok: true }; }
    catch (e) { return { ok: false, error: e.message }; }
  };

  const registrar = async (datos) => {
    try { guardarSesion(await api('/auth/registro', { metodo: 'POST', cuerpo: datos })); return { ok: true }; }
    catch (e) { return { ok: false, error: e.message }; }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{
      usuario, nombre: usuario?.usuario, rol: usuario?.rol,
      autenticado: !!usuario, esAdmin: usuario?.rol === 'admin',
      login, registrar, logout,
      loginVisible, abrirLogin: () => setLoginVisible(true), cerrarLogin: () => setLoginVisible(false),
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
