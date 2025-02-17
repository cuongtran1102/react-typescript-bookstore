import { useState } from "react";
import { Divider, Badge, Drawer, Avatar, Popover } from "antd";
import { Dropdown, Space } from "antd";
import { useNavigate } from "react-router";
import "../../styles/app.header.scss";
import { Link } from "react-router-dom";

import { logoutAPI } from "../../services/api";
import { useAppContext } from "../context/app.context";
import {
  JavaScriptOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const AppHeader = (props: any) => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const { isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser } =
    useAppContext();

  const navigate = useNavigate();

  //hàm logout user
  const handleLogout = async () => {
    const res = await logoutAPI(); //gọi api logout
    if (res.data) {
      setCurrentUser(null); //set thông tin user = null
      setIsAuthenticated(false); //set trạng thái đăng nhập false
      localStorage.removeItem("access_token"); //xóa access_token
    }
  };

  let items = [
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => alert("me")}>
          Quản lý tài khoản
        </label>
      ),
      key: "account",
    },
    {
      label: <Link to="/history">Lịch sử mua hàng</Link>,
      key: "history",
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

  //nếu user đăng nhập ko phải ADMIN thì gỡ item: Trang quản trị ra khỏi dropdown trên thanh header(sử dụng: items.unshift)
  if (currentUser?.role === "ADMIN") {
    items.unshift({
      label: <Link to="/admin">Trang quản trị</Link>,
      key: "admin",
    });
  }

  //lấy đường dẫn avatar từ currentUser
  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    currentUser?.avatar
  }`;

  const contentPopover = () => {
    return (
      <div className="pop-cart-body">
        {/* <div className='pop-cart-content'>
                    {carts?.map((book, index) => {
                        return (
                            <div className='book' key={`book-${index}`}>
                                <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${book?.detail?.thumbnail}`} />
                                <div>{book?.detail?.mainText}</div>
                                <div className='price'>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book?.detail?.price ?? 0)}
                                </div>
                            </div>
                        )
                    })}
                </div>
                {carts.length > 0 ?
                    <div className='pop-cart-footer'>
                        <button onClick={() => navigate('/order')}>Xem giỏ hàng</button>
                    </div>
                    :
                    <Empty
                        description="Không có sản phẩm trong giỏ hàng"
                    />
                } */}
      </div>
    );
  };
  return (
    <>
      <div className="header-container">
        <header className="page-header">
          <div className="page-header__top">
            <div
              className="page-header__toggle"
              onClick={() => {
                setOpenDrawer(true);
              }}
            >
              ☰
            </div>
            <div className="page-header__logo">
              <span className="logo">
                <span className="logo-home" onClick={() => navigate("/")}>
                  {" "}
                  <JavaScriptOutlined />
                  Book Store
                </span>

                <SearchOutlined className="icon-search" />
              </span>
              <input
                className="input-search"
                type={"text"}
                placeholder="Bạn tìm gì hôm nay"
                // value={props.searchTerm}
                // onChange={(e) => props.setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <nav className="page-header__bottom">
            <ul id="navigation" className="navigation">
              <li className="navigation__item">
                <Popover
                  className="popover-carts"
                  placement="topRight"
                  rootClassName="popover-carts"
                  title={"Sản phẩm mới thêm"}
                  content={contentPopover}
                  arrow={true}
                >
                  <Badge
                    // count={carts?.length ?? 0}
                    count={10}
                    size={"small"}
                    showZero
                  >
                    <ShoppingCartOutlined className="icon-cart" />
                  </Badge>
                </Popover>
              </li>
              <li className="navigation__item mobile">
                <Divider type="vertical" />
              </li>
              <li className="navigation__item mobile">
                {!isAuthenticated ? (
                  <span onClick={() => navigate("/login")}> Tài Khoản</span>
                ) : (
                  <Dropdown menu={{ items }} trigger={["click"]}>
                    <Space>
                      <Avatar src={urlAvatar} />
                      {currentUser?.fullName}
                    </Space>
                  </Dropdown>
                )}
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <Drawer
        title="Menu chức năng"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <p>Quản lý tài khoản</p>
        <Divider />

        <p onClick={() => handleLogout()}>Đăng xuất</p>
        <Divider />
      </Drawer>
    </>
  );
};

export default AppHeader;
