import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Card, message, Space, Typography } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import { login, getCaptcha, getSystemConfig } from '@/api/auth';
import type { LoginCredentials } from '@/api/auth';
import './index.css';

const { Title } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { setAccessToken, setUserInfo, systemConfig, setSystemConfig } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [form] = Form.useForm();

  // 获取系统配置
  useEffect(() => {
    const fetchSystemConfig = async () => {
      try {
        const config = await getSystemConfig();
        setSystemConfig(config);
      } catch (error) {
        console.error('获取系统配置失败', error);
      }
    };
    fetchSystemConfig();
  }, []);

  // 获取验证码
  const fetchCaptcha = async () => {
    if (!systemConfig?.loginConfig.captchaEnabled) return;
    
    try {
      const res = await getCaptcha();
      setCaptchaImage(res.captchaImage);
      setCaptchaId(res.captchaId);
    } catch (error) {
      console.error('获取验证码失败', error);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, [systemConfig?.loginConfig.captchaEnabled]);

  // 刷新验证码
  const handleRefreshCaptcha = () => {
    fetchCaptcha();
    form.setFieldsValue({ captcha: '' });
  };

  // 登录提交
  const handleSubmit = async (values: LoginCredentials) => {
    setLoading(true);
    try {
      const res = await login({
        ...values,
        captchaId: systemConfig?.loginConfig.captchaEnabled ? captchaId : undefined,
      });
      
      // 保存 Token
      setAccessToken(res.accessToken);
      
      // 获取用户信息
      try {
        const userInfo = await import('@/api/auth').then(m => m.getUserInfo());
        setUserInfo(userInfo);
        
        // 判断是否需要强制改密
        if (userInfo.mustChangePassword) {
          message.success('登录成功，请修改初始密码');
          navigate('/auth/change-password');
        } else {
          message.success('登录成功');
          navigate('/');
        }
      } catch (error) {
        console.error('获取用户信息失败', error);
        navigate('/');
      }
    } catch (error: any) {
      message.error(error.message || '登录失败');
      handleRefreshCaptcha();
      form.setFieldsValue({ captcha: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" hoverable>
        <div className="login-header">
          <Title level={2}>{systemConfig?.systemName || 'SaaS 平台'}</Title>
          <Title level={5} type="secondary">管理后台</Title>
        </div>
        
        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          {systemConfig?.loginConfig.captchaEnabled && (
            <Form.Item
              name="captcha"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Space.Compact style={{ width: '100%' }}>
                <Input 
                  prefix={<SafetyOutlined />} 
                  placeholder="验证码"
                  style={{ width: '60%' }}
                />
                <div 
                  className="captcha-image"
                  onClick={handleRefreshCaptcha}
                  dangerouslySetInnerHTML={{ __html: captchaImage }}
                  style={{ cursor: 'pointer' }}
                />
              </Space.Compact>
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
