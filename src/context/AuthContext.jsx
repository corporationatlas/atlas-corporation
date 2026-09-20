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
  // Sesión actual persistida (v2 para limpiar sesiones previas)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      localStorage.removeItem('atlas_auth_session_v1'); // Invalida cualquier sesión previa
      const saved = localStorage.getItem('atlas_auth_session_v2');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Vista activa: 'store' | 'user-portal' | 'admin-portal'
  const [currentView, setCurrentView] = useState(() => {
    try {
      const saved = localStorage.getItem('atlas_auth_session_v2');
      if (saved) {
        const u = JSON.parse(saved);
        return u.role === 'admin' ? 'admin-portal' : 'store';
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
        localStorage.setItem('atlas_auth_session_v2', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('atlas_auth_session_v2');
      }
    } catch (err) {
      console.error('Error sincronizando sesión', err);
    }
  }, [currentUser]);

  // Login por correo y clave (Conectado a Firebase + Aislamiento Estricto de Administrador)
  const login = async (email, password) => {
    setAuthError('');
    setAuthLoading(true);
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanEmail || !cleanPass) {
      setAuthError('Por favor ingresa tu correo y contraseña.');
      setAuthLoading(false);
      return { success: false };
    }

    // 1. Acceso de Dueño / Administrador de Atlas (Aislamiento Total)
    const isAdminEmail = 
      cleanEmail === 'corporationatlas969@gmail.com' ||
      cleanEmail === 'admin@atlas.com' ||
      cleanEmail === 'admin@corporationatlas.com';

    if (isAdminEmail) {
      const isValidAdminPass = 
        cleanPass === 'ADMIN2026' || 
        cleanPass === 'admin2026' || 
        cleanPass === 'atlas2026';

      if (isValidAdminPass) {
        const adminUser = {
          id: 'usr-admin-owner',
          uid: 'usr-admin-owner',
          name: 'Corporation Atlas Admin',
          email: cleanEmail,
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
      } else {
        // Bloqueo estricto: NUNCA continuar hacia autenticación de usuario regular
        setAuthError('Contraseña incorrecta. Por favor verifica tus credenciales.');
        setAuthLoading(false);
        return { success: false };
      }
    }

    // 2. Autenticación en la Nube con Google Firebase Auth & Firestore
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      const uid = userCredential.user.uid;

      // Buscar perfil en Firestore Database
      let userProfile = null;
      try {
        const userDocRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          userProfile = { ...docSnap.data(), uid, id: uid };
        }
      } catch (firestoreErr) {
        console.warn('Error leyendo perfil de Firestore:', firestoreErr);
      }

      if (!userProfile) {
        userProfile = {
          id: uid,
          uid: uid,
          name: userCredential.user.displayName || cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'user'
        };
      }

      setCurrentUser(userProfile);
      setCurrentView('store');
      setIsAuthModalOpen(false);
      setAuthLoading(false);
      return { success: true, role: userProfile.role || 'user' };

    } catch (firebaseErr) {
      console.warn('Firebase login check falló:', firebaseErr.code);

      // Respaldo verificado únicamente si existe usuario con contraseña exacta
      try {
        const savedAccounts = JSON.parse(localStorage.getItem('atlas_registered_users') || '[]');
        const found = savedAccounts.find(
          (a) => a.email && a.email.toLowerCase() === cleanEmail && a.password === cleanPass
        );
        if (found) {
          setCurrentUser(found);
          setCurrentView(found.role === 'admin' ? 'admin-portal' : 'store');
          setIsAuthModalOpen(false);
          setAuthLoading(false);
          return { success: true, role: found.role };
        }
      } catch (e) {
        console.error(e);
      }

      // Si no existe o contraseña incorrecta: RECHAZAR TOTALMENTE
      if (
        firebaseErr.code === 'auth/invalid-credential' || 
        firebaseErr.code === 'auth/wrong-password' || 
        firebaseErr.code === 'auth/user-not-found'
      ) {
        setAuthError('Credenciales incorrectas o usuario no registrado. Verifica tu correo o crea una cuenta.');
      } else if (firebaseErr.code === 'auth/too-many-requests') {
        setAuthError('Demasiados intentos fallidos. Intenta más tarde.');
      } else if (firebaseErr.code === 'auth/invalid-email') {
        setAuthError('El formato del correo electrónico no es válido.');
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
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Bloquear registro de clientes con correos reservados de administración
    if (
      cleanEmail === 'corporationatlas969@gmail.com' || 
      cleanEmail === 'admin@atlas.com' ||
      cleanEmail === 'admin@corporationatlas.com'
    ) {
      setAuthError('Este correo pertenece a la administración de Atlas. No puede ser registrado como cliente.');
      setAuthLoading(false);
      return false;
    }

    if (!name?.trim() || !cleanEmail || !cleanPass) {
      setAuthError('Por favor completa todos los campos requeridos.');
      setAuthLoading(false);
      return false;
    }

    if (cleanPass.length < 6) {
      setAuthError('La contraseña debe tener al menos 6 caracteres.');
      setAuthLoading(false);
      return false;
    }

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
        phone: (phone || '').trim(),
        city: (city || 'Caracas').trim(),
        cedula: (cedula || '').trim(),
        createdAt: new Date().toISOString()
      };

      // 2. Guardar datos completos en la colección "users" de Cloud Firestore
      try {
        await setDoc(doc(db, 'users', uid), newUser);
        console.log('✅ Usuario registrado exitosamente en Cloud Firestore:', uid);
      } catch (dbErr) {
        console.warn('Error guardando en Firestore:', dbErr);
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
      setCurrentView('store');
      setIsAuthModalOpen(false);
      setAuthLoading(false);
      return true;

    } catch (firebaseErr) {
      console.error('Error en Firebase register:', firebaseErr);

      if (firebaseErr.code === 'auth/email-already-in-use') {
        setAuthError('Este correo electrónico ya está registrado. Por favor inicia sesión.');
        setAuthLoading(false);
        return false;
      } else if (firebaseErr.code === 'auth/weak-password') {
        setAuthError('La contraseña debe tener al menos 6 caracteres.');
        setAuthLoading(false);
        return false;
      } else if (firebaseErr.code === 'auth/invalid-email') {
        setAuthError('El correo electrónico ingresado no es válido.');
        setAuthLoading(false);
        return false;
      }

      // Respaldo offline solo ante fallo de red
      if (firebaseErr.code === 'auth/network-request-failed' || firebaseErr.message?.includes('network')) {
        const localUser = {
          id: 'usr-' + Date.now(),
          name: name.trim(),
          email: cleanEmail,
          password: cleanPass,
          role: 'user',
          phone: (phone || '').trim(),
          city: (city || 'Caracas').trim(),
          cedula: (cedula || '').trim(),
          createdAt: new Date().toISOString()
        };

        const existing = JSON.parse(localStorage.getItem('atlas_registered_users') || '[]');
        if (existing.some((u) => u.email.toLowerCase() === cleanEmail)) {
          setAuthError('Este correo electrónico ya está registrado.');
          setAuthLoading(false);
          return false;
        }
        existing.push(localUser);
        localStorage.setItem('atlas_registered_users', JSON.stringify(existing));

        setCurrentUser(localUser);
        setCurrentView('store');
        setIsAuthModalOpen(false);
        setAuthLoading(false);
        return true;
      }

      setAuthError('No se pudo completar el registro. Verifica los datos e intenta de nuevo.');
      setAuthLoading(false);
      return false;
    }
  };

  // Actualizar datos del perfil (incluyendo foto de perfil)
  const updateUserProfile = async (updatedData) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);

    try {
      localStorage.setItem('atlas_auth_session_v1', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    const uid = currentUser.uid || currentUser.id;
    if (uid) {
      try {
        await setDoc(doc(db, 'users', uid), updated, { merge: true });
        console.log('✅ Perfil y avatar actualizados en Cloud Firestore:', uid);
      } catch (err) {
        console.warn('Error sincronizando perfil en Firestore:', err);
      }
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

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentView,
        setCurrentView,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authError,
        authLoading,
        login,
        register,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
