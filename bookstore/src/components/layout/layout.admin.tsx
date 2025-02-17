import { Outlet } from "react-router-dom";
import {
  AppstoreOutlined,
  ExceptionOutlined,
  HeartTwoTone,
  TeamOutlined,
  UserOutlined,
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Dropdown, Space, Avatar } from "antd";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/app.context";
import type { MenuProps } from "antd";
import { logoutAPI } from "../../services/api";
import React, { useState } from "react";
type MenuItem = Required<MenuProps>["items"][number];

const { Content, Footer, Sider } = Layout; //sử dụng các component: Content, Footer, Sider của antd

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);

  const [activeMenu, setActiveMenu] = useState("dashboard");

  const { currentUser, setCurrentUser, setIsAuthenticated, isAuthenticated } =
    useAppContext();

  //lấy đường dẫn avatar cho admin
  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    currentUser?.avatar
  }`;

  //hàm logout cho admin
  const handleLogout = async () => {
    const res = await logoutAPI();
    if (res.data) {
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
    }
  };

  const items: MenuItem[] = [
    {
      label: <Link to="/admin">Dashboard</Link>,
      key: "dashboard",
      icon: <AppstoreOutlined />,
    },
    {
      label: <span>Manage Users</span>,
      key: "user",
      icon: <UserOutlined />,
      children: [
        {
          label: <Link to="/admin/user">User</Link>,
          key: "crud",
          icon: <TeamOutlined />,
        },
        // {
        //     label: 'Files1',
        //     key: 'file1',
        //     icon: <TeamOutlined />,
        // }
      ],
    },
    {
      label: <Link to="/admin/book">Manage Books</Link>,
      key: "book",
      icon: <ExceptionOutlined />,
    },
    {
      label: <Link to="/admin/order">Manage Orders</Link>,
      key: "order",
      icon: <DollarCircleOutlined />,
    },
  ];

  const itemsDropdown = [
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => alert("me")}>
          Quản lý tài khoản
        </label>
      ),
      key: "account",
    },
    {
      label: <Link to={"/"}>Trang chủ</Link>,
      key: "home",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];

  //nếu user chưa login thì sẽ thay trang admin = trang: <ProtectedRoute>
  if (isAuthenticated === false) {
    //<Outlet/> ở đây là các trang(route con) của trang "/admin",
    //các route con này được bọc <ProtectedRoute> nên nếu isAuthenticated của user === null thì <ProtectedRoute> sẽ render các protected page(component: Result của antd)
    return <Outlet />;
  }

  const isAdminRoute = location.pathname.includes("admin");
  if (isAuthenticated === true && isAdminRoute === true) {
    const role = currentUser?.role;
    if (role === "USER") {
      return <Outlet />;
    }
  }

  return (
    <>
      <div>
        <Layout style={{ minHeight: "100vh" }} className="layout-admin">
          <Sider
            theme="light"
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <div style={{ height: 32, margin: 16, textAlign: "center" }}>
              Admin
            </div>
            <Menu
              defaultSelectedKeys={[activeMenu]}
              mode="inline"
              items={items}
              onClick={(e) => setActiveMenu(e.key)}
            />
          </Sider>
          <Layout>
            <div
              className="admin-header"
              style={{
                height: "50px",
                borderBottom: "1px solid #ebebeb",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 15px",
              }}
            >
              <span>
                {React.createElement(
                  collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                  {
                    className: "trigger",
                    onClick: () => setCollapsed(!collapsed),
                  }
                )}
              </span>
              <Dropdown menu={{ items: itemsDropdown }} trigger={["click"]}>
                <Space style={{ cursor: "pointer" }}>
                  <Avatar src={urlAvatar} />
                  {currentUser?.fullName}
                </Space>
              </Dropdown>
            </div>
            <Content style={{ padding: "15px" }}>
              <Outlet />
            </Content>
            <Footer
              style={{
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#7fffd4",
              }}
            >
              React TypeScript Book Store &copy; CuongTran - Made with{" "}
              <HeartTwoTone />
            </Footer>
          </Layout>
        </Layout>
      </div>
    </>
  );
};

export default LayoutAdmin;
