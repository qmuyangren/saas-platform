import { Form } from 'antd';
import { useCallback, useState } from 'react';

interface UseFormOptions {
  initialValues?: Record<string, any>;
  onValuesChange?: (changedValues: any, allValues: any) => void;
}

interface UseFormReturn {
  form: any;
  loading: boolean;
  setValues: (values: Record<string, any>) => void;
  getValues: () => Record<string, any>;
  validate: () => Promise<any>;
  reset: () => void;
  submit: (fn: (values: any) => Promise<any>) => Promise<void>;
}

/**
 * 表单 Hook
 */
export const useForm = (options: UseFormOptions = {}): UseFormReturn => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const setValues = useCallback((values: Record<string, any>) => {
    form.setFieldsValue(values);
  }, [form]);

  const getValues = useCallback((): Record<string, any> => {
    return form.getFieldsValue();
  }, [form]);

  const validate = useCallback(async () => {
    try {
      return await form.validateFields();
    } catch (error) {
      throw error;
    }
  }, [form]);

  const reset = useCallback(() => {
    if (options.initialValues) {
      form.setFieldsValue(options.initialValues);
    } else {
      form.resetFields();
    }
  }, [form, options.initialValues]);

  const submit = useCallback(async (fn: (values: any) => Promise<any>) => {
    try {
      setLoading(true);
      const values = await validate();
      await fn(values);
    } catch (error) {
      console.error('表单提交失败:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [validate]);

  return {
    form,
    loading,
    setValues,
    getValues,
    validate,
    reset,
    submit,
  };
};
