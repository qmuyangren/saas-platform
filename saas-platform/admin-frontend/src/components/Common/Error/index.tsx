import React from 'react';
import { Result, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface ErrorProps {
  title?: string;
  subTitle?: string;
  error?: Error;
  onRetry?: () => void;
  showRetry?: boolean;
}

const Error: React.FC<ErrorProps> = ({
  title = '出错了',
  subTitle,
  error,
  onRetry,
  showRetry = true,
}) => {
  return (
    <Result
      status="error"
      title={title}
      subTitle={subTitle || error?.message}
      extra={
        showRetry && onRetry && (
          <Button type="primary" key="retry" onClick={onRetry} icon={<ReloadOutlined />}>
            重试
          </Button>
        )
      }
    />
  );
};

export default Error;
