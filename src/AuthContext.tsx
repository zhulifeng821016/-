import React, { useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs,
  FirebaseUser 
} from './firebase';
import { User, UserRole } from './types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInAs: (uid: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  loading: true,
  signInAs: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For this specific app, we'll use a simplified "sign in" by UID
    // stored in localStorage to simulate the "Select Your Name" flow
    const savedUid = localStorage.getItem('taskassign_uid');
    
    const initUser = async (uid: string) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        } else {
          localStorage.removeItem('taskassign_uid');
          setUser(null);
        }
      } catch (e) {
        console.error("Error fetching user", e);
      } finally {
        setLoading(false);
      }
    };

    if (savedUid) {
      initUser(savedUid);
    } else {
      setLoading(false);
    }
  }, []);

  const signInAs = async (uid: string) => {
    setLoading(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        setUser(userData);
        localStorage.setItem('taskassign_uid', uid);
      }
    } catch (e) {
      console.error("Error signing in", e);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('taskassign_uid');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInAs, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
