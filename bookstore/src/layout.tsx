import { Outlet } from "react-router-dom";
import AppHeader from "./components/layout/app.header";
import { useEffect } from "react";
import { fetchUserInfoAPI } from "./services/api";
import { useAppContext } from "./components/context/app.context";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function Layout() {
  const { setCurrentUser, isAppLoading, setIsAppLoading, setIsAuthenticated } =
    useAppContext();

  useEffect(() => {
    const getUserInfo = async () => {
      let res = await fetchUserInfoAPI();
      if (res?.data?.user) {
        setCurrentUser(res.data.user);
        setIsAuthenticated(true); //khi refresh website thì isAuthenticated vẫn = true
      }
      console.log("check res getUserInfo: ", res);
    };

    getUserInfo();
    setIsAppLoading(false);
  }, []);
  return (
    <>
      {isAppLoading === true ? (
        <div className="spin">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : (
        <div>
          <AppHeader />
          <Outlet />
        </div>
      )}
    </>
  );
}

export default Layout;
