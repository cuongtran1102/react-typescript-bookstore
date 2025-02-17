import "../../../styles/register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { FormProps } from "antd";
import { App, Button, Divider, Form, Input } from "antd";
import { loginAPI } from "../../../services/api";
import { useAppContext } from "../../../components/context/app.context";

type FieldType = {
  username?: string;
  password?: string;
};

const LoginPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);

  const { message, notification } = App.useApp();

  const navigate = useNavigate();

  const { setIsAuthenticated, setCurrentUser } = useAppContext();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);

    let { username, password } = values;
    let res = await loginAPI(username, password);
    if (res?.data) {
      setIsAuthenticated(true);
      setCurrentUser(res.data.user);
      localStorage.setItem("access_token", res.data.access_token);
      message.success("Đăng nhập tài khoản thành công");
      navigate("/");
    } else {
      notification.error({
        message: "Đăng nhập không thành công",
        description: res.message,
        duration: 5,
      });
    }

    setIsSubmit(false);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <div className="register-page">
        <main className="main">
          <div className="container">
            <section className="wrapper">
              <div className="heading">
                <h2 className="text text-lage">Đăng Nhập</h2>
                <Divider />
              </div>
              <Form
                name="form-register"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item<FieldType>
                  label="Email"
                  labelCol={{ span: 24 }}
                  name="username"
                  rules={[
                    { required: true, message: "Hãy nhập email đăng nhập!" },
                    {
                      type: "email",
                      message: "email đăng nhập không đúng định dạng!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Mật khẩu"
                  labelCol={{ span: 24 }}
                  name="password"
                  rules={[
                    { required: true, message: "Hãy nhập mật khẩu đăng nhập!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item label={null}>
                  <Button type="primary" htmlType="submit" loading={isSubmit}>
                    Đăng nhập
                  </Button>
                </Form.Item>
                <Divider>Or</Divider>
                <p className="text text-normal" style={{ textAlign: "center" }}>
                  Chưa có tài khoản ?
                  <span>
                    <Link to="/register"> Đăng Ký </Link>
                  </span>
                </p>
              </Form>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default LoginPage;
