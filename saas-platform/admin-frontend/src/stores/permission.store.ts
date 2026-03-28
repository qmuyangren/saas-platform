import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MenuItem {
  key: string;
  label: string;
  icon?: string;
  path: string;
  children?: MenuItem[];
  permission?: string;
}

interface PermissionState {
  // 菜单
  menus: MenuItem[];
  setMenus: (menus: MenuItem[]) => void;

  // 权限
  permissions: string[];
  setPermissions: (permissions: string[]) => void;

  // 路由
  routes: string[];
  setRoutes: (routes: string[]) => void;

  // 清除权限
  clearPermission: () => void;
}

export const usePermissionStore = create<PermissionState>()(
  persist(
    (set) => ({
      menus: [],
      permissions: [],
      routes: [],

      setMenus: (menus) => set({ menus }),

      setPermissions: (permissions) => set({ permissions }),

      setRoutes: (routes) => set({ routes }),

      clearPermission: () =>
        set({
          menus: [],
          permissions: [],
          routes: [],
        }),
    }),
    {
      name: 'permission-storage',
    }
  )
);
