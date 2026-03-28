import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useTabsStore } from '@/stores/tabs.store';
import Header from './Header';
import TabsView from './TabsView';
import SettingsDrawer from '../Settings/SettingsDrawer';

const { Sider, Content } = Layout;

const menuItems: MenuProps['items'] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: '/users',
    icon: <UserOutlined />,
    label: '用户管理',
  },
  {
    key: '/roles',
    icon: <TeamOutlined />,
    label: '角色管理',
  },
  {
    key: '/dicts',
    icon: <FileTextOutlined />,
    label: '字典管理',
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: '系统设置',
  },
];

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const { addTab, setActiveTab } = useTabsStore();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const path = e.key;
    navigate(path);
    addTab({
      key: path,
      title: menuItems.find((item) => item?.key === path)?.label as string || path,
      path,
      closable: true,
    });
    setActiveTab(path);
  };

  // 初始化：添加当前路由到标签页
  if (location.pathname !== '/' && !location.pathname.startsWith('/auth')) {
    const currentPath = location.pathname;
    const menuItem = menuItems.find((item) => item?.key === currentPath);
    if (menuItem) {
      addTab({
        key: currentPath,
        title: menuItem.label as string,
        path: currentPath,
        closable: true,
      });
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        style={{
          overflow: 'auto',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)', borderRadius: 4 }} />
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          onOpenSettings={() => setSettingsVisible(true)}
        />
        <TabsView />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
      <SettingsDrawer
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </Layout>
  );
};

export default MainLayout;
