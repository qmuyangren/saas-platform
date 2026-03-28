import React from 'react';
import { Button as AntdButton } from 'antd';
import type { ButtonProps as AntdButtonProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface ButtonProps extends AntdButtonProps {
  loading?: boolean;
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  type = 'default',
  size = 'middle',
  loading = false,
  loadingText,
  children,
  icon,
  ...props
}) => {
  return (
    <AntdButton
      {...props}
      type={type}
      size={size}
      loading={loading}
      icon={loading ? <LoadingOutlined /> : icon}
    >
      {loading && loadingText ? loadingText : children}
    </AntdButton>
  );
};

export default Button;
