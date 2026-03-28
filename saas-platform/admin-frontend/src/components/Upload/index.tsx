import React, { useState } from 'react';
import { Upload as AntdUpload, Button, Image, message } from 'antd';
import type { UploadProps, UploadFile } from 'antd';
import { UploadOutlined, PictureOutlined } from '@ant-design/icons';

interface UploadComponentProps extends UploadProps {
  action?: string;
  maxCount?: number;
  maxSize?: number; // MB
  accept?: string;
  listType?: 'text' | 'picture' | 'picture-card';
  showUploadButton?: boolean;
  uploadText?: string;
  uploadHint?: string;
}

const Upload: React.FC<UploadComponentProps> = ({
  action,
  maxCount = 1,
  maxSize = 10,
  accept,
  listType = 'text',
  showUploadButton = true,
  uploadText = '点击上传',
  uploadHint,
  ...props
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const beforeUpload = (file: File) => {
    const isLimitSize = file.size / 1024 / 1024 < maxSize;
    if (!isLimitSize) {
      message.error(`文件大小不能超过 ${maxSize}MB!`);
    }

    const isLimitType = accept ? accept.split(',').some(type => file.type.includes(type.trim())) : true;
    if (!isLimitType) {
      message.error(`不支持的文件类型！支持：${accept}`);
    }

    return (isLimitSize && isLimitType) || AntdUpload.LIST_IGNORE;
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    props.onChange?.({ fileList: newFileList });
  };

  return (
    <div>
      <AntdUpload
        {...props}
        action={action}
        fileList={fileList}
        beforeUpload={beforeUpload}
        maxCount={maxCount}
        listType={listType}
        onChange={handleChange}
      >
        {showUploadButton && (
          <Button icon={listType === 'picture-card' ? <PictureOutlined /> : <UploadOutlined />}>
            {uploadText}
          </Button>
        )}
      </AntdUpload>
      {uploadHint && (
        <div style={{ color: '#999', fontSize: 12, marginTop: 8 }}>
          {uploadHint}
        </div>
      )}
      {listType.includes('picture') && fileList.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {fileList.map(file => (
            <Image
              key={file.uid}
              width={100}
              height={100}
              src={file.thumbUrl || file.url}
              style={{ objectFit: 'cover', marginRight: 8, marginBottom: 8 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Upload;
