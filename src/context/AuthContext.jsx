import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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
  const [authLoading, setAuthLoading] = useState(false);

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

  // Login por correo y clave (Conectado a Firebase + Credencial de Dueño)
  const login = async (email, password) => {
    setAuthError('');
    setAuthLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Acceso de Dueño / Administrador de Atlas
    if (
      (cleanEmail === 'corporationatlas969@gmail.com' && (cleanPass === 'ADMIN2026' || cleanPass === 'admin2026')) ||
      (cleanEmail === 'admin@atlas.com' && (cleanPass === 'ADMIN2026' || cleanPass === 'atlas2026'))
    ) {
      const adminUser = {
        id: 'usr-admin-owner',
        name: 'Corporation Atlas Admin',
        email: 'corporationatlas969@gmail.com',
        role: 'admin',
        phone: '+58 422 293 2455',
        city: 'Caracas',
        cedula: 'V-ADMIN-OWNER'
      };
      setCurrentUser(adminUser);
      setCurrentView('admin-portal');
      setIsAuthModalOpen(false);
      setAuthLoading(false);
      return { success: true, role: 'admin' };
    }

    // 2. Cliente Demo
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
      setAuthLoading(false);
      return { success: true, role: 'user' };
    }

    // 3. Autenticación en la Nube con Google Firebase Auth & Firestore
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      const uid = userCredential.user.uid;

      // Buscar perfil en Firestore Database
      try {
        const userDocRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const profile = docSnap.data();
          setCurrentUser(profile);
          setCurrentView(profile.role === 'admin' ? 'admin-portal' : 'user-portal');
          setIsAuthModalOpen(false);
          setAuthLoading(false);
          return { success: true, role: profile.role || 'user' };
        }
      } catch (firestoreErr) {
        console.warn('Error leyendo perfil de Firestore:', firestoreErr);
      }

      // Perfil básico si no tiene documento
      const fallbackUser = {
        id: uid,
        uid: uid,
        name: userCredential.user.displayName || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'user'
      };
      setCurrentUser(fallbackUser);
      setCurrentView('user-portal');
      setIsAuthModalOpen(false);
      setAuthLoading(false);
      return { success: true, role: 'user' };
    } catch (firebaseErr) {
      console.warn('Firebase login check falló, revisando local:', firebaseErr.code);
      
      // Fallback a cuentas guardadas localmente
      try {
        const savedAccounts = JSON.parse(localStorage.getItem('atlas_registered_users') || '[]');
        const found = savedAccounts.find(
          (a) => a.email.toLowerCase() === cleanEmail && a.password === cleanPass
        );
        if (found) {
          setCurrentUser(found);
          setCurrentView(found.role === 'admin' ? 'admin-portal' : 'user-portal');
          setIsAuthModalOpen(false);
          setAuthLoading(false);
          return { success: true, role: found.role };
        }
      } catch (e) {
        console.error(e);
      }

      if (firebaseErr.code === 'auth/invalid-credential' || firebaseErr.code === 'auth/wrong-password' || firebaseErr.code === 'auth/user-not-found') {
        setAuthError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      } else if (firebaseErr.code === 'auth/too-many-requests') {
        setAuthError('Demasiados intentos fallidos. Intenta más tarde.');
      } else {
        setAuthError('Error al iniciar sesión. Verifica tus datos de acceso.');
      }
      setAuthLoading(false);
      return { success: false };
    }
  };

  // Registro de nuevo usuario (Guardado en Google Cloud Firestore & Firebase Auth)
  const register = async ({ name, email, password, phone, city, cedula }) => {
    setAuthError('');
    setAuthLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    try {
      // 1. Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
      const uid = userCredential.user.uid;

      const newUser = {
        id: uid,
        uid: uid,
        name: name.trim(),
        email: cleanEmail,
        role: 'user',
        phone: phone.trim(),
        city: city.trim(),
        cedula: cedula.trim(),
        createdAt: new Date().toISOString()
      };

      // 2. Guardar datos completos en la colección "users" de Cloud Firestore
      try {
        await setDoc(doc(db, 'users', uid), newUser);
        console.log('✅ Usuario registrado exitosamente en Cloud Firestore:', uid);
      } catch (dbErr) {
        console.error('Error guardando en Firestore:', dbErr);
      }

      // Guardar respaldo local
      try {
        const existing = JSON.parse(localStorage.getItem('atlas_registered_users') || '[]');
        existing.push(newUser);
        localStorage.setItem('atlas_registered_users', JSON.stringify(existing));
      } catch (e) {
        console.error(e);
      }

      setCurrentUser(newUser);
      setCurrentView('user-portal');
      setIsAuthModalOpen(false);
      setAuthLoading(false);
      return true;
    } catch (firebaseErr) {
      console.error('Error en Firebase register:', firebaseErr);

      if (firebaseErr.code === 'auth/email-already-in-use') {
        setAuthError('Este correo electrónico ya está registrado.');
        setAuthLoading(false);
        return false;
      } else if (firebaseErr.code === 'auth/weak-password') {
        setAuthError('La contraseña debe tener al menos 6 caracteres.');
        setAuthLoading(false);
        return false;
      }

      // Respaldo offline si no hay conexión a internet
      const localUser = {
        id: 'usr-' + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        password: cleanPass,
        role: 'user',
        phone: phone.trim(),
        city: city.trim(),
        cedula: cedula.trim(),
        createdAt: new Date().toISOString()
      };

      try {
        const existing = JSON.parse(localStorage.getItem('atlas_registered_users') || '[]');
        if (existing.some((u) => u.email.toLowerCase() === cleanEmail)) {
          setAuthError('Este correo electrónico ya está registrado.');
          setAuthLoading(false);
          return false;
        }
        existing.push(localUser);
        localStorage.setItem('atlas_registered_users', JSON.stringify(existing));
      } catch (e) {
        console.error(e);
      }

      setCurrentUser(localUser);
      setCurrentView('user-portal');
      setIsAuthModalOpen(false);
      setAuthLoading(false);
      return true;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Error al cerrar sesión en Firebase:', e);
    }
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
