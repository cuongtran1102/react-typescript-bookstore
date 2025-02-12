import { useState } from "react";
import type { FormProps } from "antd";
import { App, Button, Divider, Form, Input } from "antd";
import "../../../styles/register.scss";
import { Link, useNavigate } from "react-router-dom";
import { registerAPI } from "../../../services/api";

type FieldType = {
  email?: string;
  password?: string;
  fullName?: string;
  phone: string;
};

const RegisterPage = () => {
  const [isSubmit, setIsSubmit] = useState(false);

  const { message } = App.useApp();

  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);

    let { fullName, email, password, phone } = values;
    let res = await registerAPI(fullName, email, password, phone);
    if (res?.data) {
      message.success("Đăng ký tài khoản thành công");
      navigate("/login");
    } else {
      message.error(res.message);
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
                <h2 className="text text-lage">Đăng Ký Tài Khoản</h2>
                <Divider />
              </div>
              <Form
                name="form-register"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item<FieldType>
                  label="Họ tên"
                  labelCol={{ span: 24 }}
                  name="fullName"
                  rules={[
                    { required: true, message: "Hãy nhập họ và tên đăng ký!" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item<FieldType>
                  label="Email"
                  labelCol={{ span: 24 }}
                  name="email"
                  rules={[
                    { required: true, message: "Hãy nhập email đăng ký!" },
                    {
                      type: "email",
                      message: "email đăng ký không đúng định dạng!",
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
                    { required: true, message: "Hãy nhập mật khẩu đăng ký!" },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item<FieldType>
                  label="Số điện thoại"
                  labelCol={{ span: 24 }}
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập số điện thoại đăng ký!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item label={null}>
                  <Button type="primary" htmlType="submit" loading={isSubmit}>
                    Đăng ký
                  </Button>
                </Form.Item>
                <Divider>Or</Divider>
                <p className="text text-normal" style={{ textAlign: "center" }}>
                  Đã có tài khoản ?
                  <span>
                    <Link to="/login"> Đăng Nhập </Link>
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

export default RegisterPage;
