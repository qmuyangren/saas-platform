import React from 'react';
import * as AntdIcons from '@ant-design/icons';

interface IconProps {
  name: string;
  size?: number | string;
  color?: string;
  spin?: boolean;
  rotate?: number;
  style?: React.CSSProperties;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 16,
  color,
  spin = false,
  rotate,
  style,
  className,
}) => {
  // 获取图标组件
  const IconComponent = (AntdIcons as any)[`${name}Outlined`] || 
                        (AntdIcons as any)[`${name}Filled`] || 
                        (AntdIcons as any)[`${name}TwoTone`] ||
                        (AntdIcons as any)[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const iconStyle: React.CSSProperties = {
    fontSize: typeof size === 'string' ? size : `${size}px`,
    color,
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
    ...style,
  };

  return (
    <span className={className}>
      <IconComponent spin={spin} style={iconStyle} />
    </span>
  );
};

export default Icon;
