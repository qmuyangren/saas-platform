import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Tab {
  key: string;
  title: string;
  path: string;
  icon?: string;
  closable?: boolean;
}

interface TabsState {
  tabs: Tab[];
  activeTab: string;
  addTab: (tab: Tab) => void;
  removeTab: (key: string) => void;
  setActiveTab: (key: string) => void;
  clearTabs: () => void;
}

export const useTabsStore = create<TabsState>()(
  persist(
    (set) => ({
      tabs: [
        { key: '/dashboard', title: '仪表盘', path: '/dashboard', closable: false },
      ],
      activeTab: '/dashboard',

      addTab: (tab) =>
        set((state) => {
          const exists = state.tabs.find((t) => t.key === tab.key);
          if (exists) {
            return { activeTab: tab.key };
          }
          return {
            tabs: [...state.tabs, tab],
            activeTab: tab.key,
          };
        }),

      removeTab: (key) =>
        set((state) => {
          const newTabs = state.tabs.filter((tab) => tab.key !== key);
          let newActive = state.activeTab;

          if (state.activeTab === key && newTabs.length > 0) {
            newActive = newTabs[newTabs.length - 1].key;
          }

          return {
            tabs: newTabs,
            activeTab: newActive,
          };
        }),

      setActiveTab: (key) => set({ activeTab: key }),

      clearTabs: () =>
        set({
          tabs: [{ key: '/dashboard', title: '仪表盘', path: '/dashboard', closable: false }],
          activeTab: '/dashboard',
        }),
    }),
    {
      name: 'tabs-storage',
    }
  )
);
