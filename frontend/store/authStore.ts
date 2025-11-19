'use client';

import { create } from 'zustand';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token:
    typeof window !== 'undefined'
      ? window.localStorage.getItem('token')
      : null,
  setToken: (token) =>
    set(() => {
      if (typeof window !== 'undefined') {
        if (token) window.localStorage.setItem('token', token);
        else window.localStorage.removeItem('token');
      }
      return { token };
    }),
}));
