import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface ThemeConfig {
  // 主题
  mode: 'light' | 'dark';
  systemTheme: boolean;
  
  // 导航模式
  navMode: 'sidebar' | 'top' | 'mix';
  
  // 特殊模式
  grayMode: boolean;
  colorWeakMode: boolean;
  
  // 功能
  keepAlive: boolean;
  showProgress: boolean;
  showLoading: boolean;
  
  // 语言
  locale: 'zh-CN' | 'en-US';
  
  // 其他
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

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeConfig>({ ...defaultTheme });

  // 计算属性
  const isDark = computed(() => theme.value.mode === 'dark');
  const isGray = computed(() => theme.value.grayMode);
  const isColorWeak = computed(() => theme.value.colorWeakMode);
  const locale = computed(() => theme.value.locale);

  // 设置主题
  const setMode = (mode: 'light' | 'dark') => {
    theme.value.mode = mode;
    applyTheme();
  };

  // 设置系统主题跟随
  const setSystemTheme = (value: boolean) => {
    theme.value.systemTheme = value;
    if (value) {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme.value.mode = isSystemDark ? 'dark' : 'light';
    }
    applyTheme();
  };

  // 设置导航模式
  const setNavMode = (mode: 'sidebar' | 'top' | 'mix') => {
    theme.value.navMode = mode;
  };

  // 设置灰色模式
  const setGrayMode = (value: boolean) => {
    theme.value.grayMode = value;
    applyTheme();
  };

  // 设置色弱模式
  const setColorWeakMode = (value: boolean) => {
    theme.value.colorWeakMode = value;
    applyTheme();
  };

  // 设置 KeepAlive
  const setKeepAlive = (value: boolean) => {
    theme.value.keepAlive = value;
  };

  // 设置语言
  const setLocale = (locale: 'zh-CN' | 'en-US') => {
    theme.value.locale = locale;
  };

  // 设置侧边栏折叠
  const setCollapsed = (value: boolean) => {
    theme.value.collapsed = value;
  };

  // 应用主题
  const applyTheme = () => {
    const html = document.documentElement;
    
    // 暗色模式
    if (theme.value.mode === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // 灰色模式
    if (theme.value.grayMode) {
      html.classList.add('gray-mode');
    } else {
      html.classList.remove('gray-mode');
    }

    // 色弱模式
    if (theme.value.colorWeakMode) {
      html.classList.add('color-weak');
    } else {
      html.classList.remove('color-weak');
    }
  };

  // 重置主题
  const resetTheme = () => {
    theme.value = { ...defaultTheme };
    applyTheme();
  };

  // 初始化
  const initTheme = () => {
    // 监听系统主题变化
    if (theme.value.systemTheme) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (theme.value.systemTheme) {
          theme.value.mode = e.matches ? 'dark' : 'light';
          applyTheme();
        }
      });
    }

    applyTheme();
  };

  return {
    theme,
    isDark,
    isGray,
    isColorWeak,
    locale,
    setMode,
    setSystemTheme,
    setNavMode,
    setGrayMode,
    setColorWeakMode,
    setKeepAlive,
    setLocale,
    setCollapsed,
    resetTheme,
    initTheme,
  };
}, {
  persist: true,
});
