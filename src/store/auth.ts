import { create } from 'zustand';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  setUser: (user) => set({ 
    user, 
    isAdmin: user?.email === import.meta.env.VITE_ADMIN_EMAIL || user?.email === 'bbindhani149@gmail.com' 
  }),
  loading: true,
  setLoading: (loading) => set({ loading }),
}));
