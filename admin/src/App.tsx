import React, { useState } from "react";
import "./App.less";
import { Layout, Menu, Typography } from "antd";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import { OrdersTable } from "./screens/Orders/OrdersTable";
import { UsersTable } from "./screens/Users/UsersTable";
import { Link, Routes, Route } from "react-router-dom";

const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(!collapsed);
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => onCollapse(collapsed)}
      >
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            <Link to="/Orders">Orders</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            <Link to="/Users">Users</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: "0 16px" }}>
          <Routes>
            <Route
              path="/Orders"
              element={
                <OrdersTable
                  page={0}
                  perPage={10}
                  sortField={"id"}
                  sortOrder={"asc"}
                />
              }
            />
            <Route path="/Users" element={<UsersTable />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
