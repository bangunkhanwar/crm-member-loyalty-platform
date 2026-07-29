import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'elcorps_auth';

// role -> home route setelah login
export const ROLE_HOME = {
  member: '/member/dashboard',
  toko: '/toko/dashboard',
  admin: '/admin/dashboard',
  head: '/head/dashboard',
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null); // { token, role, user }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setAuth(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = (data) => {
    // data: { token, role, user }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setAuth(data);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading, isAuthenticated: !!auth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);