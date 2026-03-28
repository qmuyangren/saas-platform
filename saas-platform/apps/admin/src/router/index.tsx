import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import LoginPage from '../pages/Login';
import ChangePasswordPage from '../pages/ChangePassword';
import DashboardPage from '../pages/Dashboard';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/change-password',
    element: <ChangePasswordPage />,
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
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
]);

export default router;
