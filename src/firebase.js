import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Credenciales oficiales del proyecto Google Firebase Atlas Corporation
const firebaseConfig = {
  apiKey: "AIzaSyDx2sL19vsc-YrmyfknZCM0oBN1cn_K3YA",
  authDomain: "atlas-corporation-737bc.firebaseapp.com",
  projectId: "atlas-corporation-737bc",
  storageBucket: "atlas-corporation-737bc.firebasestorage.app",
  messagingSenderId: "581064181515",
  appId: "1:581064181515:web:5a18bdabd33499ddc9840e",
  measurementId: "G-F1WSFTPTWQ"
};

// Inicialización de la app y servicios de Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
