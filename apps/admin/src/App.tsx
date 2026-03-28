import { Outlet } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <div className="app">
        <Outlet />
      </div>
    </ConfigProvider>
  );
}

export default App;
