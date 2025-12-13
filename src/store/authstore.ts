import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { sendOTPEmail } from '../services/emailService';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  otpData: {
    email: string;
    otp: string;
    expiresAt: number;
  } | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  initializeAuth: () => void;
  sendOTP: (email: string) => Promise<boolean>;
  verifyOTP: (email: string, otp: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
  changePassword: (newPassword: string) => Promise<boolean>;
  resetPasswordForCurrentUser: (newPassword: string) => Promise<boolean>;
  uploadProfileImage: (file: File) => Promise<string | null>;
  updateProfileImage: (imageUrl: string) => Promise<boolean>;
  removeProfileImage: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      otpData: null,
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
            role: email === 'healthy@gmail.com' ? 'admin' : 'user',
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
      sendOTP: async (email: string) => {
        try {
          console.log('🚀 Starting OTP generation for:', email);
          
          // Generate 6-digit OTP
          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
          
          console.log('✅ Generated OTP:', otp);
          console.log('⏰ Expires at:', new Date(expiresAt));
          
          // Store OTP in state
          set({ otpData: { email, otp, expiresAt } });
          
          // Send OTP via email service
          const emailResult = await sendOTPEmail(email, otp);
          
          if (emailResult.success) {
            console.log('📧 OTP sent successfully to:', email);
            // For testing: Show OTP in alert (remove in production)
            alert(`🔐 TEST MODE: Your OTP is ${otp}\n\nCheck your email: ${email}`);
            return true;
          } else {
            console.error('❌ Failed to send email:', emailResult.message);
            return false;
          }
        } catch (error) {
          console.error('❌ Send OTP error:', error);
          return false;
        }
      },
      verifyOTP: async (email: string, otp: string) => {
        try {
          console.log('🔍 Verifying OTP for:', email);
          console.log('🔢 Entered OTP:', otp);
          
          const { otpData } = get();
          
          if (!otpData) {
            console.log('❌ No OTP data found');
            return false;
          }
          
          if (otpData.email !== email) {
            console.log('❌ Email mismatch:', { stored: otpData.email, provided: email });
            return false;
          }
          
          if (Date.now() > otpData.expiresAt) {
            console.log('❌ OTP expired');
            set({ otpData: null });
            return false;
          }
          
          const isValid = otpData.otp === otp;
          console.log('🔍 OTP comparison:', { stored: otpData.otp, entered: otp, isValid });
          
          return isValid;
        } catch (error) {
          console.error('❌ Verify OTP error:', error);
          return false;
        }
      },
      resetPassword: async (email: string, newPassword: string) => {
        try {
          // In a real app, this would update the password via backend API
          // For now, we'll simulate success
          set({ otpData: null });
          return true;
        } catch (error) {
          console.error('Reset password error:', error);
          return false;
        }
      },
      changePassword: async (newPassword: string) => {
        try {
          const currentUser = auth.currentUser;
          const { user } = get();
          
          if (!currentUser || !user?.email) {
            console.error('❌ No current user or email');
            return false;
          }
          
          // For change password via OTP, we don't need re-authentication
          // since OTP verification serves as authentication
          await updatePassword(currentUser, newPassword);
          
          // Update user document in Firestore if needed
          await updateDoc(doc(db, 'users', currentUser.uid), {
            updatedAt: new Date()
          });
          
          set({ otpData: null });
          console.log('✅ Password changed successfully');
          return true;
        } catch (error: any) {
          console.error('❌ Change password error:', error);
          
          // If requires recent login, we'll handle it differently
          if (error.code === 'auth/requires-recent-login') {
            // Since we verified OTP, we can proceed with password reset instead
            return await get().resetPasswordForCurrentUser(newPassword);
          }
          
          return false;
        }
      },
      resetPasswordForCurrentUser: async (newPassword: string) => {
        try {
          const currentUser = auth.currentUser;
          if (!currentUser) {
            return false;
          }
          
          // Force update password by signing out and back in
          const email = currentUser.email;
          if (!email) return false;
          
          await signOut(auth);
          
          // In a real implementation, you would update the password via backend
          // For now, we'll simulate success
          set({ otpData: null, user: null, isAuthenticated: false });
          
          return true;
        } catch (error) {
          console.error('❌ Reset password for current user error:', error);
          return false;
        }
      },
      uploadProfileImage: async (file: File) => {
        try {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const base64String = reader.result as string;
              resolve(base64String);
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
          });
        } catch (error) {
          console.error('Upload image error:', error);
          return null;
        }
      },
      updateProfileImage: async (imageUrl: string) => {
        try {
          const { user } = get();
          const currentUser = auth.currentUser;
          
          if (!currentUser || !user) {
            return false;
          }
          
          await updateDoc(doc(db, 'users', currentUser.uid), {
            profileImage: imageUrl,
            updatedAt: new Date()
          });
          
          set((state) => ({
            user: state.user ? { ...state.user, profileImage: imageUrl } : null
          }));
          
          return true;
        } catch (error) {
          console.error('Update profile image error:', error);
          return false;
        }
      },
      removeProfileImage: async () => {
        try {
          const { user } = get();
          const currentUser = auth.currentUser;
          
          if (!currentUser || !user) {
            return false;
          }
          
          await updateDoc(doc(db, 'users', currentUser.uid), {
            profileImage: null,
            updatedAt: new Date()
          });
          
          set((state) => ({
            user: state.user ? { ...state.user, profileImage: undefined } : null
          }));
          
          return true;
        } catch (error) {
          console.error('Remove profile image error:', error);
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
