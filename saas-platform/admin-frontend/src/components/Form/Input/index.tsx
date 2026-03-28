import React from 'react';
import { Input as AntdInput } from 'antd';
import type { InputProps as AntdInputProps } from 'antd';

interface InputProps extends AntdInputProps {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div style={{ marginBottom: error ? 0 : 16 }}>
      {label && (
        <div style={{ marginBottom: 8, fontWeight: 500 }}>
          {label}
          {props.required && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
        </div>
      )}
      <AntdInput {...props} status={error ? 'error' : undefined} />
      {error && (
        <div style={{ color: '#ff4d4f', fontSize: 12, marginTop: 4 }}>{error}</div>
      )}
    </div>
  );
};

export default Input;
