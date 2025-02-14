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
        path: "/book",
        element: <BookPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/checkout",
        element: <div>Check out page</div>,
      },
      {
        path: "/admin",
        element: <div>Admin page</div>,
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
        <RouterProvider router={router} />
      </AppContextProvider>
    </App>
  </StrictMode>
);
