import { defineComponent, ref } from 'vue';
import { Drawer, Divider, Switch, Select, Space, Button, Tooltip } from 'ant-design-vue';
import {
  SettingOutlined,
  LeftOutlined,
  RightOutlined,
  MoonOutlined,
  SunOutlined,
  LaptopOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue';
import { useThemeStore } from '@/stores/theme.store';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'SettingsPanel',
  setup() {
    const visible = ref(false);
    const themeStore = useThemeStore();
    const { t, locale } = useI18n();

    const navModes = [
      { label: '侧边栏', value: 'sidebar' },
      { label: '顶部导航', value: 'top' },
      { label: '混合导航', value: 'mix' },
    ];

    const locales = [
      { label: '中文', value: 'zh-CN' },
      { label: 'English', value: 'en-US' },
    ];

    return () => (
      <>
        {/* 设置按钮 */}
        <div
          class="settings-trigger"
          onClick={() => (visible.value = true)}
        >
          <SettingOutlined spin={visible.value} />
        </div>

        {/* 设置面板 */}
        <Drawer
          title={t('theme.title')}
          placement="right"
          width={300}
          open={visible.value}
          onClose={() => (visible.value = false)}
        >
          {/* 主题模式 */}
          <Divider orientation="left">{t('theme.mode')}</Divider>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Tooltip title={t('theme.light')}>
                <Button
                  icon={<SunOutlined />}
                  type={themeStore.theme.mode === 'light' ? 'primary' : 'default'}
                  onClick={() => themeStore.setMode('light')}
                />
              </Tooltip>
              <Tooltip title={t('theme.dark')}>
                <Button
                  icon={<MoonOutlined />}
                  type={themeStore.theme.mode === 'dark' ? 'primary' : 'default'}
                  onClick={() => themeStore.setMode('dark')}
                />
              </Tooltip>
              <Tooltip title={t('theme.system')}>
                <Button
                  icon={<LaptopOutlined />}
                  type={themeStore.theme.systemTheme ? 'primary' : 'default'}
                  onClick={() => themeStore.setSystemTheme(!themeStore.theme.systemTheme)}
                />
              </Tooltip>
            </Space>
          </Space>

          {/* 导航模式 */}
          <Divider orientation="left">{t('theme.navMode')}</Divider>
          <Select
            value={themeStore.theme.navMode}
            options={navModes}
            onChange={themeStore.setNavMode}
            style={{ width: '100%' }}
          />

          {/* 特殊模式 */}
          <Divider orientation="left">特殊模式</Divider>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <span>{t('theme.grayMode')}</span>
              <Switch
                checked={themeStore.theme.grayMode}
                onChange={(checked) => themeStore.setGrayMode(checked as boolean)}
              />
            </Space>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <span>{t('theme.colorWeakMode')}</span>
              <Switch
                checked={themeStore.theme.colorWeakMode}
                onChange={(checked) => themeStore.setColorWeakMode(checked as boolean)}
              />
            </Space>
          </Space>

          {/* 功能开关 */}
          <Divider orientation="left">功能开关</Divider>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <span>{t('theme.keepAlive')}</span>
              <Switch
                checked={themeStore.theme.keepAlive}
                onChange={(checked) => themeStore.setKeepAlive(checked as boolean)}
              />
            </Space>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <span>{t('theme.showProgress')}</span>
              <Switch
                checked={themeStore.theme.showProgress}
                onChange={(checked) => (themeStore.theme.showProgress = checked as boolean)}
              />
            </Space>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <span>{t('theme.showLoading')}</span>
              <Switch
                checked={themeStore.theme.showLoading}
                onChange={(checked) => (themeStore.theme.showLoading = checked as boolean)}
              />
            </Space>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <span>{t('theme.fixedHeader')}</span>
              <Switch
                checked={themeStore.theme.fixedHeader}
                onChange={(checked) => (themeStore.theme.fixedHeader = checked as boolean)}
              />
            </Space>
          </Space>

          {/* 语言切换 */}
          <Divider orientation="left">语言 / Language</Divider>
          <Select
            value={locale.value}
            options={locales}
            onChange={(value) => {
              locale.value = value as 'zh-CN' | 'en-US';
              themeStore.setLocale(value as 'zh-CN' | 'en-US');
            }}
            style={{ width: '100%' }}
          />

          {/* 重置按钮 */}
          <Divider />
          <Button
            block
            icon={<ReloadOutlined />}
            onClick={() => themeStore.resetTheme()}
          >
            {t('theme.reset')}
          </Button>
        </Drawer>
      </>
    );
  },
});
