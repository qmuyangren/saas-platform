import { Drawer, Divider, Switch, Button, Space, Tooltip } from 'antd';
import {
  SettingOutlined,
  MoonOutlined,
  SunOutlined,
  LaptopOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useThemeStore } from '@/stores/theme.store';

interface SettingsDrawerProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ visible, onClose }) => {
  const themeStore = useThemeStore();

  return (
    <Drawer
      title="主题设置"
      placement="right"
      width={300}
      open={visible}
      onClose={onClose}
    >
      {/* 主题模式 */}
      <Divider orientation="left">主题模式</Divider>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Tooltip title="亮色">
            <Button
              icon={<SunOutlined />}
              type={themeStore.theme.mode === 'light' ? 'primary' : 'default'}
              onClick={() => themeStore.setMode('light')}
            />
          </Tooltip>
          <Tooltip title="暗色">
            <Button
              icon={<MoonOutlined />}
              type={themeStore.theme.mode === 'dark' ? 'primary' : 'default'}
              onClick={() => themeStore.setMode('dark')}
            />
          </Tooltip>
          <Tooltip title="跟随系统">
            <Button
              icon={<LaptopOutlined />}
              type={themeStore.theme.systemTheme ? 'primary' : 'default'}
              onClick={() => themeStore.setSystemTheme(!themeStore.theme.systemTheme)}
            />
          </Tooltip>
        </Space>
      </Space>

      {/* 导航模式 */}
      <Divider orientation="left">导航模式</Divider>
      {/* TODO: 添加导航模式选择器 */}

      {/* 特殊模式 */}
      <Divider orientation="left">特殊模式</Divider>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <span>灰色模式</span>
          <Switch
            checked={themeStore.theme.grayMode}
            onChange={(checked) => themeStore.setGrayMode(checked as boolean)}
          />
        </Space>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <span>色弱模式</span>
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
          <span>缓存页面</span>
          <Switch
            checked={themeStore.theme.keepAlive}
            onChange={(checked) => themeStore.setKeepAlive(checked as boolean)}
          />
        </Space>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <span>顶部进度条</span>
          <Switch
            checked={themeStore.theme.showProgress}
            onChange={(checked) => (themeStore.theme.showProgress = checked as boolean)}
          />
        </Space>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <span>切换 Loading</span>
          <Switch
            checked={themeStore.theme.showLoading}
            onChange={(checked) => (themeStore.theme.showLoading = checked as boolean)}
          />
        </Space>
      </Space>

      {/* 重置按钮 */}
      <Divider />
      <Button
        block
        icon={<ReloadOutlined />}
        onClick={() => themeStore.resetTheme()}
      >
        重置主题
      </Button>
    </Drawer>
  );
};

export default SettingsDrawer;
