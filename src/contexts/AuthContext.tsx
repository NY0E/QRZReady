'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, callSign?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  exportUserData: () => Promise<Record<string, unknown>>;
  deleteAccount: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email: string, password: string, callSign?: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    if (callSign) {
      await updateProfile(user, {
        displayName: callSign
      });
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const exportUserData = async (): Promise<Record<string, unknown>> => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('You must be signed in to export your data.');

    const progressSnap = await getDocs(collection(db, 'users', currentUser.uid, 'progress'));
    const scoresSnap = await getDocs(collection(db, 'users', currentUser.uid, 'scores'));

    return {
      account: {
        uid: currentUser.uid,
        email: currentUser.email,
        callSign: currentUser.displayName,
        createdAt: currentUser.metadata.creationTime,
      },
      progress: Object.fromEntries(progressSnap.docs.map((d) => [d.id, d.data()])),
      scores: scoresSnap.docs.map((d) => d.data()),
      exportedAt: new Date().toISOString(),
    };
  };

  const deleteAccount = async (password: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) throw new Error('You must be signed in to delete your account.');

    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);

    const progressSnap = await getDocs(collection(db, 'users', currentUser.uid, 'progress'));
    const scoresSnap = await getDocs(collection(db, 'users', currentUser.uid, 'scores'));
    await Promise.all([
      ...progressSnap.docs.map((d) => deleteDoc(d.ref)),
      ...scoresSnap.docs.map((d) => deleteDoc(d.ref)),
      deleteDoc(doc(db, 'users', currentUser.uid)),
    ]);

    await deleteUser(currentUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
    exportUserData,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
