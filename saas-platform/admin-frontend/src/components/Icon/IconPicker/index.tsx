import React, { useState } from 'react';
import { Input, Popover, Button } from 'antd';
import * as AntdIcons from '@ant-design/icons';
import Icon from '../Icon';

// 常用图标列表
const commonIcons = [
  'Home',
  'User',
  'Setting',
  'Search',
  'Edit',
  'Delete',
  'Plus',
  'Minus',
  'Close',
  'Check',
  'Loading',
  'Eye',
  'EyeInvisible',
  'Lock',
  'Unlock',
  'Upload',
  'Download',
  'Export',
  'Import',
  'Refresh',
  'Reload',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Menu',
  'Dashboard',
  'Table',
  'Form',
  'Profile',
];

interface IconPickerProps {
  value?: string;
  onChange?: (iconName: string) => void;
  placeholder?: string;
}

const IconPicker: React.FC<IconPickerProps> = ({
  value = '',
  onChange,
  placeholder = '选择图标',
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (iconName: string) => {
    onChange?.(iconName);
    setOpen(false);
  };

  const content = (
    <div style={{ width: 300 }}>
      <div style={{ marginBottom: 8, fontWeight: 500 }}>常用图标</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 8,
          maxHeight: 300,
          overflowY: 'auto',
        }}
      >
        {commonIcons.map((iconName) => (
          <Button
            key={iconName}
            type={value === iconName ? 'primary' : 'default'}
            size="small"
            onClick={() => handleSelect(iconName)}
            style={{ width: 40, height: 40, padding: 0 }}
          >
            <Icon name={iconName} size={18} />
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      placement="bottomLeft"
    >
      <Input
        value={value}
        placeholder={placeholder}
        readOnly
        prefix={value ? <Icon name={value} /> : null}
        suffix={<Icon name="Down" />}
        style={{ cursor: 'pointer' }}
      />
    </Popover>
  );
};

export default IconPicker;
