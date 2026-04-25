import { createContext, useContext, useEffect, useState } from 'react';
import { me, login as loginApi } from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('m4u_token');
    if (!token) { setLoading(false); return; }
    me()
      .then(setAdmin)
      .catch(() => localStorage.removeItem('m4u_token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { token, admin: adminData } = await loginApi(email, password);
    localStorage.setItem('m4u_token', token);
    setAdmin(adminData);
    return adminData;
  };

  const logout = () => {
    localStorage.removeItem('m4u_token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
