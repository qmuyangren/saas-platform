import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

interface LoadingProps {
  tip?: string;
  size?: 'small' | 'default' | 'large';
  fullscreen?: boolean;
  children?: React.ReactNode;
}

const Loading: React.FC<LoadingProps> = ({
  tip = '加载中...',
  size = 'large',
  fullscreen = false,
  children,
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: size === 'small' ? 14 : size === 'default' ? 24 : 32 }} spin />;

  if (fullscreen) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <Spin indicator={antIcon} tip={tip} size={size} />
      </div>
    );
  }

  if (children) {
    return (
      <Spin indicator={antIcon} tip={tip} size={size}>
        {children}
      </Spin>
    );
  }

  return <Spin indicator={antIcon} tip={tip} size={size} />;
};

export default Loading;
