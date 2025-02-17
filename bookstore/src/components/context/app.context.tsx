import { createContext, useContext, useEffect, useState } from "react";
import { fetchUserInfoAPI } from "../../services/api";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "../../styles/register.scss";

const AppContext = createContext<IAppContext | null>(null);
//AppContext sẽ có type là interface IAppContext hoặc null
//AppContext sẽ được khởi tạo là: null

//props của AppContextProvider sẽ có type là: interface IProps
const AppContextProvider = (props: IProps) => {
  //biến isAuthenticated có type: boolean và được khởi tạo = false
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  //biến currentUser có type: interface IUserInfo hoặc null và được khởi tạo = null
  const [currentUser, setCurrentUser] = useState<IUserInfo | null>(null);

  //biến isAppLoading sẽ quy định trạng thái loadding cho trang web, khởi tạo = true
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);

  //gọi useEffect ở AppContext để cả trang admin và user đều lấy được thông tin người dùng và trang thái đăng nhập thông qua: fetchUserInfoAPI()
  useEffect(() => {
    const getUserInfo = async () => {
      let res = await fetchUserInfoAPI();
      if (res?.data?.user) {
        setCurrentUser(res.data.user); //set thông tin cho user thông qua setCurrentUser của AppContext
        setIsAuthenticated(true); //khi refresh website thì isAuthenticated vẫn = true
      }
      setIsAppLoading(false);
    };

    getUserInfo();
  }, []);

  return (
    <>
      {isAppLoading === true ? (
        <div className="spin">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : (
        <AppContext.Provider
          value={{
            isAuthenticated,
            currentUser,
            setIsAuthenticated,
            setCurrentUser,
            isAppLoading,
            setIsAppLoading,
          }}
        >
          {/* truyền các biến: isAuthenticated, currentUser, setIsAuthenticated, setCurrentUser,... 
          cho các component được <AppContextProvider/> bọc ở main.tsx * bằng method: AppContext.Provider */}

          {/* sử dụng: {props.children} */}
          {props.children}
        </AppContext.Provider>
      )}
    </>
  );
};

// hàm useAppContext sẽ return appContext để các component sử dụng,
// vd: const { isAuthenticated, currentUser, setIsAuthenticated, setCurrentUser } = useAppContext();
const useAppContext = () => {
  const appContext = useContext(AppContext);

  if (!appContext) {
    throw new Error("appContext has to be used within </AppContext.Provider>");
  }

  return appContext;
};

export { AppContextProvider, useAppContext };
