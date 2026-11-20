import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

export function useAuth() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email, password) => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(friendlyError(e.code));
    }
  };

  const register = async (email, password) => {
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(friendlyError(e.code));
    }
  };

  const logout = () => signOut(auth);

  return { user, loading, error, login, register, logout, setError };
}

function friendlyError(code) {
  const map = {
    'auth/user-not-found':     'E-mail não encontrado.',
    'auth/wrong-password':     'Senha incorreta.',
    'auth/invalid-credential': 'E-mail ou senha inválidos.',
    'auth/email-already-in-use': 'Este e-mail já está em uso.',
    'auth/weak-password':      'Senha muito fraca (mín. 6 caracteres).',
    'auth/invalid-email':      'E-mail inválido.',
  };
  return map[code] || 'Erro ao autenticar. Tente novamente.';
}
