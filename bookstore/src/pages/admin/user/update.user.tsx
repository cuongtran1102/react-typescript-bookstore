import { App, Divider, Form, FormProps, Input, Modal } from "antd";
import { useEffect, useState } from "react";
import { updateUserAPI } from "../../../services/api";

//khai báo các props cho component UpdateUser
interface IProps {
  refreshTable: () => void;
  //data chứa thông tin user update
  dataUpdate: IUserTable | null;
  setDataUpdate: (dataUpdate: IUserTable | null) => void;
  //state open modal để update user
  openModalUpdate: boolean;
  setOpenModalUpdate: (openModalUpdate: boolean) => void;
}

//FieldType cho form update user
type FieldType = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
};

const UpdateUser = (props: IProps) => {
  const {
    refreshTable,
    dataUpdate,
    setDataUpdate,
    openModalUpdate,
    setOpenModalUpdate,
  } = props;

  //state loading cho button update user
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const { message, notification } = App.useApp();

  const [form] = Form.useForm(); //use form của antd

  //useEffect để khi open modal update user thì thông tin user được click sẽ truyền từ table hiển thị lên modal
  useEffect(() => {
    if (dataUpdate) {
      //fill các thông tin user lên các input của form update user(sử dụng method setFieldsValue của antd)
      form.setFieldsValue({
        _id: dataUpdate._id,
        fullName: dataUpdate.fullName,
        email: dataUpdate.email,
        phone: dataUpdate.phone,
      });
    }
  }, [dataUpdate]); //truyền dataUpdate để useEffect theo dõi sự thay đổi dataUpdate mỗi khi click vào các user khác nhau

  //hàm cập nhật user
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { _id, fullName, phone } = values; //lấy thông tin cập nhật từ form
    setIsSubmit(true);
    const res = await updateUserAPI(_id, fullName, phone);
    if (res && res.data) {
      message.success("Cập nhật user thành công");
      form.resetFields();
      setOpenModalUpdate(false); //đóng modal update user
      setDataUpdate(null); //set data user null
      refreshTable(); //refresh lại table
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <div>
        <Modal
          title="Cập nhật người dùng"
          open={openModalUpdate}
          onOk={() => {
            form.submit();
          }}
          onCancel={() => {
            setOpenModalUpdate(false);
            setDataUpdate(null);
            form.resetFields(); //reset thông tin user đã fill ở form
          }}
          okText={"Cập nhật"}
          cancelText={"Hủy"}
          confirmLoading={isSubmit}
        >
          <Divider />

          <Form
            form={form}
            name="form-update"
            style={{ maxWidth: 600 }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              hidden
              labelCol={{ span: 24 }}
              label="_id"
              name="_id"
              rules={[{ required: true, message: "Vui lòng nhập _id!" }]}
            >
              <Input disabled />
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
              <Input disabled />
            </Form.Item>

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

export default UpdateUser;
