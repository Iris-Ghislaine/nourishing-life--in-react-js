import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      login: async (email: string, password: string) => {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            set({ user: userData, isAuthenticated: true, loading: false });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      register: async (email: string, password: string, name: string, phone?: string) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user: User = {
            id: userCredential.user.uid,
            email,
            name,
            role: email === 'health@gmail.com' ? 'admin' : 'user',
            phone,
            createdAt: new Date(),
          };
          
          await setDoc(doc(db, 'users', user.id), user);
          set({ user, isAuthenticated: true, loading: false });
          return true;
        } catch (error) {
          console.error('Registration error:', error);
          return false;
        }
      },
      logout: async () => {
        try {
          await signOut(auth);
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },
      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },
      initializeAuth: () => {
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data() as User;
              set({ user: userData, isAuthenticated: true, loading: false });
            }
          } else {
            set({ user: null, isAuthenticated: false, loading: false });
          }
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
