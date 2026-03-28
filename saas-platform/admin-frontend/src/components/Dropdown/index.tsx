import React from 'react';
import { Dropdown as AntdDropdown, Button } from 'antd';
import type { DropdownProps as AntdDropdownProps, MenuProps } from 'antd';
import { DownOutlined } from '@ant-design/icons';

interface DropdownProps extends AntdDropdownProps {
  trigger?: ('hover' | 'click')[];
  menu?: MenuProps;
  children?: React.ReactNode;
  buttonProps?: React.ComponentProps<typeof Button>;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger = ['click'],
  menu,
  children,
  buttonProps,
  ...props
}) => {
  return (
    <AntdDropdown
      {...props}
      trigger={trigger}
      menu={menu}
    >
      {children || (
        <Button {...buttonProps}>
          下拉菜单 <DownOutlined />
        </Button>
      )}
    </AntdDropdown>
  );
};

export default Dropdown;
