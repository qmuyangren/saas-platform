import { Layout, Button, Dropdown, Avatar, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  FullscreenOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;

const Header: React.FC<{
  collapsed?: boolean;
  onCollapse: () => void;
  onOpenSettings: () => void;
}> = ({ collapsed = false, onCollapse, onOpenSettings }) => {
  const handleFullscreen = () => {
    document.documentElement.requestFullscreen().catch((e) => {
      console.log('全屏失败:', e);
    });
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      onClick: onOpenSettings,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  return (
    <AntHeader
      style={{
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,21,41,.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onCollapse}
          style={{ fontSize: 16 }}
        />
      </div>

      <Space size="large">
        <Button
          type="text"
          icon={<FullscreenOutlined />}
          onClick={handleFullscreen}
        />
        <Button
          type="text"
          icon={<SettingOutlined />}
          onClick={onOpenSettings}
        />
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" arrow>
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar icon={<UserOutlined />} />
            <span>Admin</span>
          </div>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Header;
