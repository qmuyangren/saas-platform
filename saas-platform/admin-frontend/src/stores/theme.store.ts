import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThemeConfig {
  mode: 'light' | 'dark';
  systemTheme: boolean;
  navMode: 'sidebar' | 'top' | 'mix';
  grayMode: boolean;
  colorWeakMode: boolean;
  keepAlive: boolean;
  showProgress: boolean;
  showLoading: boolean;
  locale: 'zh-CN' | 'en-US';
  collapsed: boolean;
  fixedHeader: boolean;
}

const defaultTheme: ThemeConfig = {
  mode: 'light',
  systemTheme: false,
  navMode: 'sidebar',
  grayMode: false,
  colorWeakMode: false,
  keepAlive: true,
  showProgress: true,
  showLoading: true,
  locale: 'zh-CN',
  collapsed: false,
  fixedHeader: true,
};

interface ThemeState {
  theme: ThemeConfig;
  setMode: (mode: 'light' | 'dark') => void;
  setSystemTheme: (value: boolean) => void;
  setNavMode: (mode: 'sidebar' | 'top' | 'mix') => void;
  setGrayMode: (value: boolean) => void;
  setColorWeakMode: (value: boolean) => void;
  setKeepAlive: (value: boolean) => void;
  setLocale: (locale: 'zh-CN' | 'en-US') => void;
  setCollapsed: (value: boolean) => void;
  resetTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: { ...defaultTheme },
      
      setMode: (mode) =>
        set((state) => ({
          theme: { ...state.theme, mode },
        })),
      
      setSystemTheme: (value) =>
        set((state) => ({
          theme: { ...state.theme, systemTheme: value },
        })),
      
      setNavMode: (mode) =>
        set((state) => ({
          theme: { ...state.theme, navMode: mode },
        })),
      
      setGrayMode: (value) =>
        set((state) => ({
          theme: { ...state.theme, grayMode: value },
        })),
      
      setColorWeakMode: (value) =>
        set((state) => ({
          theme: { ...state.theme, colorWeakMode: value },
        })),
      
      setKeepAlive: (value) =>
        set((state) => ({
          theme: { ...state.theme, keepAlive: value },
        })),
      
      setLocale: (locale) =>
        set((state) => ({
          theme: { ...state.theme, locale },
        })),
      
      setCollapsed: (value) =>
        set((state) => ({
          theme: { ...state.theme, collapsed: value },
        })),
      
      resetTheme: () =>
        set({
          theme: { ...defaultTheme },
        }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
