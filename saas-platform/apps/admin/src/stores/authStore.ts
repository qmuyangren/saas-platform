import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo, SystemConfig } from '@/api/auth';

interface AuthState {
  // Token
  accessToken: string | null;
  
  // 用户信息
  userInfo: UserInfo | null;
  
  // 系统配置
  systemConfig: SystemConfig | null;
  
  // Actions
  setAccessToken: (token: string | null) => void;
  setUserInfo: (userInfo: UserInfo | null) => void;
  setSystemConfig: (config: SystemConfig | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      userInfo: null,
      systemConfig: null,
      
      setAccessToken: (token) => set({ accessToken: token }),
      setUserInfo: (userInfo) => set({ userInfo }),
      setSystemConfig: (config) => set({ systemConfig: config }),
      clearAuth: () => set({ accessToken: null, userInfo: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
      }),
    }
  )
);
