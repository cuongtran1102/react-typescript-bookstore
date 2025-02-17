import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Layout from "./layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/client/auth/login";
import RegisterPage from "./pages/client/auth/register";
import BookPage from "./pages/client/book";
import AboutPage from "./pages/client/about";
import "./styles/global.scss";
import HomePage from "./pages/client/home";
import { App } from "antd"; //sử dụng component App của antd để bọc toàn bộ router
import { AppContextProvider } from "./components/context/app.context";
import ProtectedRoute from "./components/layout/protected.route";
import LayoutAdmin from "./components/layout/layout.admin";
import DashBoardPage from "./pages/admin/dashboard";
import ManageBookPage from "./pages/admin/manage.book";
import ManageUserPage from "./pages/admin/manage.user";
import ManageOrderPage from "./pages/admin/manage.order";
import { ConfigProvider } from "antd";
import enUS from "antd/es/locale/en_US";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "book",
        element: <BookPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            {/* bọc các components con mà ProtectedRoute muốn bảo vệ */}
            <div>Check out page</div>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashBoardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "book",
        element: (
          <ProtectedRoute>
            <ManageBookPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "order",
        element: (
          <ProtectedRoute>
            <ManageOrderPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <ManageUserPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* bọc App của antd cho tất cả router để sử dụng component message, notification của antd */}
    <App>
      {/* bọc AppContextProvider cho tất cả router để các component có thể sử dụng các biến: isAuthenticated, setIsAuthenticated, currentUser, setCurrentUser, ...*/}
      <AppContextProvider>
        <ConfigProvider locale={enUS}>
          <RouterProvider router={router} />
        </ConfigProvider>
      </AppContextProvider>
    </App>
  </StrictMode>
);
