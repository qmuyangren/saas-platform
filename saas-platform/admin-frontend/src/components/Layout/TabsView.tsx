import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useTabsStore } from '@/stores/tabs.store';
import { useNavigate } from 'react-router-dom';

const TabsView: React.FC = () => {
  const navigate = useNavigate();
  const { tabs, activeTab, addTab, removeTab, setActiveTab } = useTabsStore();

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigate(key);
  };

  const handleTabEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: string,
  ) => {
    if (action === 'remove') {
      removeTab(targetKey as string);
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
          label: tab.title,
          closable: tab.closable,
        }))}
        style={{ marginBottom: 0 }}
      />
    </div>
  );
};

export default TabsView;
