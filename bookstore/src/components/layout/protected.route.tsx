import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../context/app.context";
import { Button, Result } from "antd";

const ProtectedRoute = (props: IProps) => {
  const { isAuthenticated, currentUser } = useAppContext();
  const currentURL = useLocation();
  const isAdminRoute = currentURL.pathname.includes("admin");

  if (isAuthenticated === false) {
    return (
      <div>
        <Result
          status="404"
          title="404"
          subTitle="Hãy đăng nhập để truy cập tính năng này!"
          extra={
            <Button type="primary">
              <Link to={"/login"}>Đăng nhập</Link>
            </Button>
          }
        />
      </div>
    );
  }
  if (isAuthenticated === true && isAdminRoute === true) {
    if (currentUser?.role === "USER") {
      return (
        <div>
          <Result
            status="403"
            title="403"
            subTitle="Bạn không có quyền truy cập trang này!"
            extra={
              <Button type="primary">
                <Link to={"/"}>Back Home</Link>
              </Button>
            }
          />
        </div>
      );
    }
  }
  return (
    <>
      {/* props.children là các components con được component cha: ProtectedRoute bọc lại(bọc bên: main.tsx) */}
      <div>{props.children}</div>
    </>
  );
};

export default ProtectedRoute;
