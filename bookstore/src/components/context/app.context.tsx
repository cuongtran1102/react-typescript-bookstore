import { createContext, useContext, useState } from "react";

const AppContext = createContext<IAppContext | null>(null);
//AppContext sẽ có type là interface IAppContext hoặc null
//AppContext sẽ được khởi tạo là: null

//props của AppContextProvider sẽ có type là: interface IProps
const AppContextProvider = (props: IProps) => {
  //biến isAuthenticated có type: boolean và được khởi tạo = false
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  //biến currentUser có type: interface IUserInfo hoặc null và được khởi tạo = null
  const [currentUser, setCurrentUser] = useState<IUserInfo | null>(null);

  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);

  return (
    <>
      {/* truyền các biến: isAuthenticated, currentUser, setIsAuthenticated, setCurrentUser,... 
      cho các component được <AppContextProvider/> bọc ở main.tsx * bằng method: AppContext.Provider */}
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
        {/* sử dụng: {props.children} */}
        {props.children}
      </AppContext.Provider>
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
