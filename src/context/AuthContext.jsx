import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de un AuthProvider');
  }
  return context;
};

// Cuentas preconfiguradas
const defaultAccounts = [
  {
    id: 'usr-admin',
    name: 'Oscar Ramirez',
    email: 'admin@atlas.com',
    password: 'atlas2026',
    role: 'admin',
    phone: '+1 555-555-5556',
    city: 'Caracas',
    cedula: 'V-14.821.902'
  },
  {
    id: 'usr-client',
    name: 'Carlos Mendoza',
    email: 'cliente@atlas.com',
    password: 'cliente123',
    role: 'user',
    phone: '+58 414 5551234',
    city: 'Valencia',
    cedula: 'V-18.942.311'
  }
];

export const AuthProvider = ({ children }) => {
  // Sesión actual persistida
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('atlas_auth_session_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Vista activa: 'store' | 'user-portal' | 'admin-portal'
  const [currentView, setCurrentView] = useState(() => {
    try {
      const saved = localStorage.getItem('atlas_auth_session_v1');
      if (saved) {
        const u = JSON.parse(saved);
        return u.role === 'admin' ? 'admin-portal' : 'user-portal';
      }
      return 'store';
    } catch {
      return 'store';
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('atlas_auth_session_v1', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('atlas_auth_session_v1');
      }
    } catch (err) {
      console.error('Error sincronizando sesión', err);
    }
  }, [currentUser]);

  // Login por correo y clave
  const login = (email, password) => {
    setAuthError('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Verificar Admin / Propietario (Acceso a correcciones y CMS)
    if (
      (cleanEmail === 'corporationatlas969@gmail.com' && (cleanPass === 'ADMIN2026' || cleanPass === 'admin2026')) ||
      (cleanEmail === 'admin@atlas.com' && (cleanPass === 'ADMIN2026' || cleanPass === 'atlas2026'))
    ) {
      const adminUser = {
        id: 'usr-admin-owner',
        name: 'Corporation Atlas Admin',
        email: 'corporationatlas969@gmail.com',
        role: 'admin',
        phone: '+1 555-555-5556',
        city: 'Caracas',
        cedula: 'V-ADMIN-OWNER'
      };
      setCurrentUser(adminUser);
      setCurrentView('admin-portal');
      setIsAuthModalOpen(false);
      return { success: true, role: 'admin' };
    }

    // 2. Verificar cliente demo
    if (cleanEmail === 'cliente@atlas.com' && cleanPass === 'cliente123') {
      const clientUser = {
        id: 'usr-client',
        name: 'Carlos Mendoza',
        email: cleanEmail,
        role: 'user',
        phone: '+58 414 5551234',
        city: 'Valencia',
        cedula: 'V-18.942.311'
      };
      setCurrentUser(clientUser);
      setCurrentView('user-portal');
      setIsAuthModalOpen(false);
      return { success: true, role: 'user' };
    }

    // 3. Verificar en lista de cuentas registradas en localStorage
    try {
      const savedAccounts = JSON.parse(localStorage.getItem('atlas_registered_users') || '[]');
      const found = savedAccounts.find(
        (a) => a.email.toLowerCase() === cleanEmail && a.password === cleanPass
      );
      if (found) {
        setCurrentUser(found);
        setCurrentView(found.role === 'admin' ? 'admin-portal' : 'user-portal');
        setIsAuthModalOpen(false);
        return { success: true, role: found.role };
      }
    } catch (e) {
      console.error(e);
    }

    setAuthError('Credenciales incorrectas. Verifica tu correo y contraseña.');
    return { success: false };
  };

  // Registro de nuevo usuario (Cliente)
  const register = ({ name, email, password, phone, city, cedula }) => {
    setAuthError('');
    const cleanEmail = email.trim().toLowerCase();

    const newUser = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password: password.trim(),
      role: 'user',
      phone: phone.trim(),
      city: city.trim(),
      cedula: cedula.trim()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('atlas_registered_users') || '[]');
      if (existing.some((u) => u.email.toLowerCase() === cleanEmail)) {
        setAuthError('Este correo electrónico ya está registrado.');
        return false;
      }
      existing.push(newUser);
      localStorage.setItem('atlas_registered_users', JSON.stringify(existing));
    } catch (e) {
      console.error(e);
    }

    setCurrentUser(newUser);
    setCurrentView('user-portal');
    setIsAuthModalOpen(false);
    return true;
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    setCurrentView('store');
  };

  // Quick 1-click test helpers
  const loginQuickAdmin = () => {
    login('admin@atlas.com', 'atlas2026');
  };

  const loginQuickClient = () => {
    login('cliente@atlas.com', 'cliente123');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentView,
        setCurrentView,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authError,
        login,
        register,
        logout,
        loginQuickAdmin,
        loginQuickClient
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
