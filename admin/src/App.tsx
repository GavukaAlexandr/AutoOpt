import React, { useEffect, useState } from "react";
import "./App.less";
import { Layout, Menu, Typography } from "antd";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import { OrdersTable } from "./screens/Orders/OrdersTable";
import { UsersTable } from "./screens/Users/UsersTable";
import { useLocation, NavLink, Routes, Route, Outlet } from "react-router-dom";
import { LoginPage } from "./screens/LoginPage";
import { RequireAuth } from "./AuthProvider";
import { TypeTable } from "./screens/Types/TypeTable";
import { BrandTable } from "./screens/Brands/BrandTable";
import { ModelTable } from "./screens/Models/ModelTable";

const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  let location = useLocation();

  const [auth, setAuth] = useState(false);

  const changeAuth = (value: boolean) => {
    return setAuth(value);
  };

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(!collapsed);
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {auth ? (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={() => onCollapse(collapsed)}
        >
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["/"]}
            selectedKeys={[location.pathname]}
          >
            <Menu.Item key="/" icon={<PieChartOutlined />}>
              <NavLink to="/">Orders</NavLink>
            </Menu.Item>
            <Menu.Item key="/users" icon={<DesktopOutlined />}>
              <NavLink to="/users">Users</NavLink>
            </Menu.Item>
            <Menu.Item key="/types" icon={<DesktopOutlined />}>
              <NavLink to="/types">Transport types</NavLink>
            </Menu.Item>
            <Menu.Item key="/brands" icon={<DesktopOutlined />}>
              <NavLink to="/brands">Brands</NavLink>
            </Menu.Item>
            <Menu.Item key="/models" icon={<DesktopOutlined />}>
              <NavLink to="/models">Models</NavLink>
            </Menu.Item>
          </Menu>
        </Sider>
      ) : null}
      <Layout className="site-layout">
        <Content style={{ margin: "24px 16px 0" }}>
          <Routes>
            <Route element={<RequireAuth changeAuth={changeAuth} />}>
              <Route
                path="/"
                element={
                  <OrdersTable
                    page={0}
                    perPage={50}
                    sortField={"createdAt"}
                    sortOrder={"desc"}
                  />
                }
              />
              <Route
                path="/users"
                element={
                  <UsersTable
                    page={0}
                    perPage={50}
                    sortField={"firstName"}
                    sortOrder={"desc"}
                  />
                }
              />
              <Route
                path="/types"
                element={
                  <TypeTable
                    page={0}
                    perPage={50}
                    sortField={"name"}
                    sortOrder={"asc"}
                  />
                }
              />
              <Route
                path="/brands"
                element={
                  <BrandTable
                    page={0}
                    perPage={50}
                    sortField={"name"}
                    sortOrder={"asc"}
                  />
                }
              />
              <Route
                path="/models"
                element={
                  <ModelTable
                    page={0}
                    perPage={50}
                    sortField={"name"}
                    sortOrder={"desc"}
                  />
                }
              />
            </Route>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
