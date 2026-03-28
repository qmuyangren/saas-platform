import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // 侧边栏
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // 加载状态
  loading: boolean;
  setLoading: (loading: boolean) => void;

  // 全屏
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;

  // 刷新
  reloadKey: number;
  triggerReload: () => void;

  // 清除状态
  clearApp: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // 侧边栏
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      // 加载状态
      loading: false,
      setLoading: (loading) => set({ loading }),

      // 全屏
      fullscreen: false,
      setFullscreen: (fullscreen) => set({ fullscreen }),

      // 刷新
      reloadKey: 0,
      triggerReload: () => set((state) => ({ reloadKey: state.reloadKey + 1 })),

      // 清除状态
      clearApp: () =>
        set({
          sidebarCollapsed: false,
          loading: false,
          fullscreen: false,
          reloadKey: 0,
        }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
