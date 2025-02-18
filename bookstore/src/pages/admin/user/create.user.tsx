import { App, Divider, Form, FormProps, Input, Modal } from "antd";
import { createUserAPI } from "../../../services/api";
import { useState } from "react";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (openModalCreate: boolean) => void;
  refreshTable: () => void;
}

//FieldType cho form create user
type FieldType = {
  fullName: string;
  password: string;
  email: string;
  phone: string;
};

const CreateUserModal = (props: IProps) => {
  const { openModalCreate, setOpenModalCreate, refreshTable } = props;

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const { message, notification } = App.useApp();

  const [form] = Form.useForm(); //khai báo thuộc tính form của antd

  //hàm onFinish để tạo user cho form create user
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { fullName, password, email, phone } = values;

    setIsSubmit(true);

    let res = await createUserAPI(fullName, email, password, phone);
    if (res?.data) {
      message.success("Create user success");

      form.resetFields(); //reset các ô input của form create user

      setOpenModalCreate(false); //đóng modal create user

      refreshTable(); //reload table user sau khi thêm mới 1 user
    } else {
      notification.error({
        message: "Create user failre",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <div>
        {/*----------modal create user----------*/}
        <Modal
          title="Create user"
          open={openModalCreate} //mở modal với state openModalCreate
          onCancel={() => {
            setOpenModalCreate(false); //đóng modal khi click button cancel
            form.resetFields(); //reset các ô input của form create user
          }}
          onOk={() => {
            form.submit(); //khi click vào button OK của modal thì form create user sẽ submit
          }}
          okText="Create"
          cancelText="Cancel"
          confirmLoading={isSubmit} //thiết lập hiệu ứng loadding cho button create của modal
        >
          <Divider />

          {/*----------form create user------------*/}
          <Form
            form={form} //sử dụng thuộc tính: form cho form create user
            name="basic"
            style={{ maxWidth: "600px" }}
            autoComplete="off"
            onFinish={onFinish} //truyền hàm onFinish cho form
          >
            {/*sử dụng FieldType cho item của form create user*/}
            <Form.Item<FieldType>
              labelCol={{ span: 24 }}
              label="Tên hiển thị"
              name="fullName"
              rules={[
                { required: true, message: "Vui lòng nhập tên hiển thị!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              labelCol={{ span: 24 }}
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không đúng định dạng!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
              labelCol={{ span: 24 }}
              label="Password"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item<FieldType>
              labelCol={{ span: 24 }}
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default CreateUserModal;
