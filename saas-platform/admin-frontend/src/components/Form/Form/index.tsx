import React from 'react';
import { Form as AntdForm } from 'antd';
import type { FormProps as AntdFormProps } from 'antd';

interface FormProps extends AntdFormProps {
  labelWidth?: number;
  labelAlign?: 'left' | 'right';
}

const Form: React.FC<FormProps> = ({
  labelWidth = 100,
  labelAlign = 'right',
  layout = 'horizontal',
  labelCol = { flex: `${labelWidth}px` },
  wrapperCol = { flex: 'auto' },
  children,
  ...props
}) => {
  return (
    <AntdForm
      {...props}
      layout={layout}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      labelAlign={labelAlign}
    >
      {children}
    </AntdForm>
  );
};

// 导出 Form 相关组件
Form.Item = AntdForm.Item;
Form.List = AntdForm.List;
Form.Provider = AntdForm.Provider;
Form.useForm = AntdForm.useForm;

export default Form;
