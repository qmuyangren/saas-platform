import { Tabs } from 'antd';
import { useState } from 'react';
import type { TabsProps } from 'antd';

interface Tab {
  key: string;
  label: string;
  closable?: boolean;
}

const TabsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('/dashboard');
  const [tabs, setTabs] = useState<Tab[]>([
    { key: '/dashboard', label: '仪表盘', closable: false },
  ]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    // TODO: 路由跳转
  };

  const handleTabEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: string,
  ) => {
    if (action === 'remove') {
      const newTabs = tabs.filter((tab) => tab.key !== targetKey);
      setTabs(newTabs);
      
      if (activeTab === targetKey && newTabs.length > 0) {
        setActiveTab(newTabs[newTabs.length - 1].key);
      }
    }
  };

  return (
    <div style={{
      background: '#fff',
      borderBottom: '1px solid #f0f0f0',
      padding: '8px 16px 0',
    }}>
      <Tabs
        hideAdd
        type="editable-card"
        activeKey={activeTab}
        onChange={handleTabChange}
        onEdit={handleTabEdit}
        items={tabs.map((tab) => ({
          key: tab.key,
          label: tab.label,
          closable: tab.closable,
        }))}
        style={{ marginBottom: 0 }}
      />
    </div>
  );
};

export default TabsView;
