import React from 'react';
import { Descriptions as AntdDescriptions } from 'antd';
import type { DescriptionsProps as AntdDescriptionsProps, DescriptionsItemProps } from 'antd';

interface DescriptionsProps extends AntdDescriptionsProps {
  title?: React.ReactNode;
  bordered?: boolean;
  column?: number;
  size?: 'default' | 'middle' | 'small';
  items?: Array<{
    label: React.ReactNode;
    children: React.ReactNode;
    span?: number;
  }>;
}

const Descriptions: React.FC<DescriptionsProps> & {
  Item: React.FC<DescriptionsItemProps>;
} = ({
  title,
  bordered = true,
  column = 3,
  size = 'default',
  items = [],
  children,
  ...props
}) => {
  return (
    <AntdDescriptions
      {...props}
      title={title}
      bordered={bordered}
      column={column}
      size={size}
    >
      {items.length > 0
        ? items.map((item, index) => (
            <AntdDescriptions.Item key={index} label={item.label} span={item.span}>
              {item.children}
            </AntdDescriptions.Item>
          ))
        : children}
    </AntdDescriptions>
  );
};

Descriptions.Item = AntdDescriptions.Item;

export default Descriptions;
