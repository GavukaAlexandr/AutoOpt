import React, { useEffect, useState } from "react";
import "./App.less";
import { Layout, Menu, Typography } from "antd";
import {
  CarOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useLocation, NavLink, Outlet } from "react-router-dom";

const { Title } = Typography;
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
            <NavLink to="/">Orders</NavLink>
          </Menu.Item>
          <Menu.Item key="/users" icon={<TeamOutlined />}>
            <NavLink to="/users">Users</NavLink>
          </Menu.Item>
          <Menu.Item key="/types" icon={<MenuOutlined />}>
            <NavLink to="/types">Types</NavLink>
          </Menu.Item>
          <Menu.Item key="/brands" icon={<TagOutlined />}>
            <NavLink to="/brands">Brands</NavLink>
          </Menu.Item>
          <Menu.Item key="/models" icon={<CarOutlined />}>
            <NavLink to="/models">Models</NavLink>
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
