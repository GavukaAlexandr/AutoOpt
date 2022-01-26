import "./App.less";
import { Layout, Menu } from "antd";
import {
  CarOutlined,
  MenuOutlined,
  ShoppingCartOutlined, 
  TagOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useLocation, NavLink, Outlet } from "react-router-dom";
const { Header, Content } = Layout;


const MainLayout = () => {
  let location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["/"]}
          selectedKeys={[location.pathname]}
        >
          <Menu.Item key="/" icon={<ShoppingCartOutlined />}>
            <NavLink to="/">Заказы </NavLink>
          </Menu.Item>
          <Menu.Item key="/users" icon={<TeamOutlined />}>
            <NavLink to="/users">Пользователи</NavLink>
          </Menu.Item>
          <Menu.Item key="/types" icon={<MenuOutlined />}>
            <NavLink to="/types">Типы транспорта</NavLink>
          </Menu.Item>
          <Menu.Item key="/brands" icon={<TagOutlined />}>
            <NavLink to="/brands">Бренды</NavLink>
          </Menu.Item>
          <Menu.Item key="/models" icon={<CarOutlined />}>
            <NavLink to="/models">Модели</NavLink>
          </Menu.Item>
        </Menu>
      </Header>
      <Layout className="site-layout">
        <Content style={{ margin: "24px 16px 0" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
