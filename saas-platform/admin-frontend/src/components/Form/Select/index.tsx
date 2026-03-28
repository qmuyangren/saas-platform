import React from 'react';
import { Select as AntdSelect } from 'antd';
import type { SelectProps as AntdSelectProps } from 'antd';

interface SelectProps extends AntdSelectProps {
  label?: string;
  error?: string;
  options?: Array<{ label: string; value: string | number }>;
}

const Select: React.FC<SelectProps> = ({ label, error, options, ...props }) => {
  return (
    <div style={{ marginBottom: error ? 0 : 16 }}>
      {label && (
        <div style={{ marginBottom: 8, fontWeight: 500 }}>
          {label}
          {props.required && <span style={{ color: 'red', marginLeft: 4 }}>*</span>}
        </div>
      )}
      <AntdSelect
        {...props}
        options={options}
        status={error ? 'error' : undefined}
        style={{ width: '100%', ...props.style }}
      />
      {error && (
        <div style={{ color: '#ff4d4f', fontSize: 12, marginTop: 4 }}>{error}</div>
      )}
    </div>
  );
};

export default Select;
