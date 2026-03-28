import React from 'react';
import { Drawer as AntdDrawer } from 'antd';
import type { DrawerProps as AntdDrawerProps } from 'antd';

interface DrawerProps extends AntdDrawerProps {
  title?: React.ReactNode;
  visible?: boolean;
  onClose?: () => void;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  width?: number | string;
  size?: 'default' | 'large';
}

const Drawer: React.FC<DrawerProps> = ({
  title,
  visible = false,
  onClose,
  placement = 'right',
  width,
  size = 'default',
  children,
  ...props
}) => {
  const drawerWidth = width || (size === 'large' ? 720 : 480);

  return (
    <AntdDrawer
      {...props}
      title={title}
      open={visible}
      onClose={onClose}
      placement={placement}
      width={drawerWidth}
    >
      {children}
    </AntdDrawer>
  );
};

export default Drawer;
