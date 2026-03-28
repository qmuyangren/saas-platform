import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import AuthGuard from './AuthGuard';
import MainLayout from '@/components/Layout/MainLayout';
import LoginPage from '@/pages/Login';
import DashboardPage from '@/pages/Dashboard';
import ChangePasswordPage from '@/pages/ChangePassword';

// 所有路由配置
const routes: RouteObject[] = [
  // 公开路由（不需要认证）
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/change-password',
    element: <ChangePasswordPage />,
  },
  
  // 受保护的路由（需要认证）
  {
    path: '/',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
    ],
  },
];

// 创建路由
const router = createBrowserRouter(routes);

export default router;
