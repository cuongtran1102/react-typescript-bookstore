import { InboxOutlined } from "@ant-design/icons";
import { App, Modal, Table, Upload } from "antd";
import type { UploadProps } from "antd";
import Exceljs from "exceljs";
import { useState } from "react";
import { Buffer } from "buffer";
import { importUserAPI } from "../../../services/api";

interface IProps {
  openModalImport: boolean;
  setOpenModalImport: (openModalImport: boolean) => void;
  refreshTable: () => void;
}

//interface cho table hiển thị thông tin file excel sau khi import
interface IDataImport {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

const { Dragger } = Upload; //khai báo Dragger để kéo thả file

const ImportUser = (props: IProps) => {
  const { message, notification } = App.useApp();

  const { openModalImport, setOpenModalImport, refreshTable } = props;

  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  //state dataImport là 1 array các object, mỗi object là 1 user thuộc interface IDataImport
  //dataImport có nhiệm vụ lưu thông tin các user đọc từ file excel
  const [dataImport, setDataImport] = useState<IDataImport[]>([]);

  //khai báo uploadProps thuộc type UploadProps cho Dragger để đọc và hiển thị file excel
  const uploadProps: UploadProps = {
    name: "file",
    multiple: false, //không cho upload nhiều file cùng lúc
    maxCount: 1,
    //chỉ cho phép upload file excel
    accept:
      ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    //chờ 1s trước khi upload file
    customRequest({ file, onSuccess }) {
      setTimeout(() => {
        if (onSuccess) onSuccess("ok");
      }, 1000);
    },

    //xử lý upload file trong hàm onChange
    async onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log("status !== uploading", info.file, info.fileList);
      }
      //xử lý file nếu status === "done"
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`); //thông báo upload file thành công

        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj!;

          //load file to buffer
          const workbook = new Exceljs.Workbook(); //tạo workbook
          const arrayBuffer = await file.arrayBuffer(); //convert file arrayBuffer
          const buffer = Buffer.from(arrayBuffer); //chuyển arrayBuffer thành buffer hoàn chỉnh
          await workbook.xlsx.load(buffer); //load buffer chứa data của file vào workbook

          //convert file to json
          let jsonData: IDataImport[] = [];
          //duyệt các dòng trong workbook
          workbook.worksheets.forEach(function (sheet) {
            // read first row as data keys
            let firstRow = sheet.getRow(1);

            if (!firstRow.cellCount) return;

            let keys = firstRow.values as any[];

            sheet.eachRow((row, rowNumber) => {
              if (rowNumber == 1) return;
              let values = row.values as any;
              let obj: any = { key: rowNumber }; //Thêm key cho từng hàng
              for (let i = 1; i < keys.length; i++) {
                obj[keys[i]] = values[i] || ""; //Xử lý cột trống
              }
              jsonData.push(obj);
            });
          });

          setDataImport(jsonData); //set data cho dataImport
        }
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },

    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleImportUsers = async () => {
    setIsSubmit(true); //tạ hiệu ứng loading

    //array dataSubmit được copy từ array dataImport với method map để convert các thuộc tính của array dataImport sang string mới lưu xuống db được
    const dataSubmit = dataImport.map((item) => ({
      fullName: item.fullName.toString(),
      email: item.email.toString(),
      password: item.password.toString(),
      phone: item.phone.toString(),
    }));

    console.log("check data import: ", dataSubmit);

    //truyền dataSubmit vào hàm importUserAPI
    let res = await importUserAPI(dataSubmit);
    console.log("check res import user: ", res);
    if (res.data) {
      notification.success({
        message: "Import users",
        //hiển thị thông báo import thành công và thất bại bao nhiêu user
        description: `Success = ${res.data.countSuccess}. Error = ${res.data.countError}`,
      });
      setIsSubmit(false);
      setOpenModalImport(false);
      setDataImport([]);
      refreshTable();
    }
  };

  return (
    <>
      <div>
        <Modal
          title="import user"
          width={"50vw"}
          open={openModalImport}
          onOk={handleImportUsers}
          onCancel={() => {
            setOpenModalImport(false);
            setIsSubmit(false);
          }}
          okText="Import file"
          okButtonProps={{
            disabled: dataImport.length > 0 ? false : true,
            loading: isSubmit,
          }}
        >
          {/* truyền uploadProps cho Dragger để xử lý upload file */}
          <Dragger
            {...uploadProps}
            onRemove={() => {
              setDataImport([]);
            }}
          >
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
              dataSource={dataImport} //truyền dataImport cho table để hiển thị thông tin từng user import từ file
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
