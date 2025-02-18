import { InboxOutlined } from "@ant-design/icons";
import { Modal, Table, Upload } from "antd";
import type { UploadProps } from "antd";

interface IProps {
  openModalImport: boolean;
  setOpenModalImport: (openModalImport: boolean) => void;
}

const { Dragger } = Upload;

const ImportUser = (props: IProps) => {
  const { openModalImport, setOpenModalImport } = props;

  const propsUpload: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept:
      ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };

  return (
    <>
      <div>
        <Modal
          title="import user"
          width={"50vw"}
          open={openModalImport}
          onOk={() => {
            setOpenModalImport(false);
          }}
          onCancel={() => {
            setOpenModalImport(false);
          }}
          okText="Import file"
        >
          <Dragger {...propsUpload}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single upload. Only accept .csv, .xls, .xlsx
            </p>
          </Dragger>
          <div style={{ paddingTop: 20 }}>
            <Table
              title={() => <span>Dữ liệu upload:</span>}
              columns={[
                { dataIndex: "fullName", title: "Full name" },
                { dataIndex: "email", title: "Email" },
                { dataIndex: "password", title: "Pasword" },
                { dataIndex: "phone", title: "Phone" },
              ]}
            />
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ImportUser;
