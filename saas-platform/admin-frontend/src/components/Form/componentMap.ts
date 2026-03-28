import Input from '../Input';
import Select from '../Select';
import Upload from '../Upload';
import { Input as AntdInput, Select as AntdSelect, InputNumber, DatePicker, Radio, Checkbox, Switch, TimePicker, TreeSelect, Cascader, Slider, Rate } from 'antd';

/**
 * 表单组件映射
 */
export const componentMap = new Map<string, React.ComponentType<any>>();

// 注册自定义组件
componentMap.set('input', Input);
componentMap.set('textarea', () => <Input.TextArea rows={4} />);
componentMap.set('select', Select);
componentMap.set('upload', Upload);

// 注册 Ant Design 组件
componentMap.set('password', () => <AntdInput.Password />);
componentMap.set('number', InputNumber);
componentMap.set('date', DatePicker);
componentMap.set('datetime', () => <DatePicker showTime />);
componentMap.set('radio', Radio.Group);
componentMap.set('checkbox', Checkbox.Group);
componentMap.set('switch', Switch);
componentMap.set('time', TimePicker);
componentMap.set('tree', TreeSelect);
componentMap.set('cascader', Cascader);
componentMap.set('slider', Slider);
componentMap.set('rate', Rate);

/**
 * 获取组件
 */
export const getComponent = (name: string) => {
  return componentMap.get(name);
};

/**
 * 注册组件
 */
export const registerComponent = (name: string, component: React.ComponentType<any>) => {
  componentMap.set(name, component);
};

/**
 * 获取所有组件
 */
export const getAllComponents = () => {
  return Array.from(componentMap.entries());
};
