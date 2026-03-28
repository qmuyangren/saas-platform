import React from 'react';
import { Upload as AntdUpload, message } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

interface UploadComponentProps extends UploadProps {
  label?: string;
  maxCount?: number;
  maxSize?: number; // MB
}

const { Dragger } = AntdUpload;

const Upload: React.FC<UploadComponentProps> = ({
  label,
  maxCount = 1,
  maxSize = 10,
  ...props
}) => {
  const beforeUpload = (file: File) => {
    const isLimitSize = file.size / 1024 / 1024 < maxSize;
    if (!isLimitSize) {
      message.error(`文件大小不能超过 ${maxSize}MB!`);
    }
    return isLimitSize || AntdUpload.LIST_IGNORE;
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <div style={{ marginBottom: 8, fontWeight: 500 }}>
          {label}
          {props.required && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
        </div>
      )}
      <Dragger
        {...props}
        beforeUpload={beforeUpload}
        maxCount={maxCount}
        style={{ padding: '20px 0' }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">
          支持单个或批量上传，单个文件不能超过 {maxSize}MB
        </p>
      </Dragger>
    </div>
  );
};

export default Upload;
