import React from 'react';
import { Modal as AntdModal } from 'antd';
import type { ModalProps as AntdModalProps } from 'antd';

interface ModalProps extends AntdModalProps {
  title: React.ReactNode;
  visible?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  width?: number | string;
  centered?: boolean;
  maskClosable?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  title,
  visible = false,
  onOk,
  onCancel,
  width = 520,
  centered = true,
  maskClosable = false,
  okText = '确定',
  cancelText = '取消',
  children,
  ...props
}) => {
  return (
    <AntdModal
      {...props}
      title={title}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={width}
      centered={centered}
      maskClosable={maskClosable}
      okText={okText}
      cancelText={cancelText}
    >
      {children}
    </AntdModal>
  );
};

export default Modal;
