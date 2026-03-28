import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserInfo {
  id: string;
  account: string;
  realName?: string;
  nickName?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  role?: string;
  permissions?: string[];
}

interface UserState {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo | null) => void;
  updateUserInfo: (userInfo: Partial<UserInfo>) => void;
  clearUserInfo: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userInfo: null,

      setUserInfo: (userInfo) => set({ userInfo }),

      updateUserInfo: (userInfo) =>
        set((state) => ({
          userInfo: state.userInfo ? { ...state.userInfo, ...userInfo } : null,
        })),

      clearUserInfo: () => set({ userInfo: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);
