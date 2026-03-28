import React from 'react';
import { Card as AntdCard } from 'antd';
import type { CardProps as AntdCardProps } from 'antd';

interface CardProps extends AntdCardProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  extra,
  bordered = true,
  hoverable = false,
  children,
  ...props
}) => {
  return (
    <AntdCard
      {...props}
      title={title}
      extra={extra}
      bordered={bordered}
      hoverable={hoverable}
    >
      {children}
    </AntdCard>
  );
};

export default Card;
