// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';

import { auth } from '@/firebase/firebaseconfig';
import { User } from 'firebase/auth'; // Import User type from Firebase
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext<{ user: User | null }>({ user: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}