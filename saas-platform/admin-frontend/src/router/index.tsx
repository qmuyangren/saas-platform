import { createBrowserRouter, RouteObject } from 'react-router-dom';
import AuthGuard from './AuthGuard';
import MainLayout from '@/components/Layout/MainLayout';
import LoginPage from '@/pages/Login';
import DashboardPage from '@/pages/Dashboard';
import ChangePasswordPage from '@/pages/ChangePassword';

// 公开路由（不需要认证）
const publicRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/change-password',
    element: <ChangePasswordPage />,
  },
];

// 受保护的路由（需要认证）
const protectedRoutes: RouteObject[] = [
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
      // 后续添加其他路由
      // {
      //   path: 'users',
      //   element: <UserListPage />,
      // },
      // {
      //   path: 'roles',
      //   element: <RoleListPage />,
      // },
    ],
  },
];

// 合并所有路由
const router = createBrowserRouter([...publicRoutes, ...protectedRoutes]);

export default router;
