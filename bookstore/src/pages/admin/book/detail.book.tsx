import {
  Badge,
  Descriptions,
  Divider,
  Drawer,
  GetProp,
  Image,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import dayjs from "dayjs";
import { FORMAT_DATE } from "../../../services/helper";
import { useEffect, useState } from "react";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
import { v4 as uuidv4 } from "uuid"; //sử dụng thư viện uuid để generate uuid ngẫu nhiên cho các img của book

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (openViewDetail: boolean) => void;
  dataViewDetail: IBook | null;
  setDataViewDetail: (dataViewDetail: IBook | null) => void;
}

const DetailBook = (props: IProps) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  //state fileList là 1 array các object thuộc interface: UploadFile, khởi tạo rỗng
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  //2 state: previewOpen, previewImage dùng để xem chi tiết các img của book trong component: Upload của antd
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  //---------------------------------------------------------------------------------------------------------//
  const [previewTitle, setPreviewTitle] = useState("");

  //lấy danh sách các img của book khi drawer detail book open
  useEffect(() => {
    if (dataViewDetail) {
      let imgThumbnail: any = {}; //imgthumbnail của book là 1 object có type: UploadFile
      let imgSlider: UploadFile[] = []; //imgSlider của book là 1 array các object có type: UploadFile
      if (dataViewDetail.thumbnail) {
        //khởi tạo data cho object imgThumbnail
        imgThumbnail = {
          uid: uuidv4(), //generate uuid cho imgThumbnail
          name: dataViewDetail.thumbnail, //name của imgThumbnail là tên file ảnh thumbnail của book
          status: "done", //status khởi tạo: 'done'
          url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
            dataViewDetail.thumbnail
          }`, //url của img thumbnail
        };
      }
      if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
        //duyệt từng item của array dataViewDetail.slider(array chứa ten file các img thumbnail của book)
        dataViewDetail.slider.map((item) => {
          //push các item của array dataViewDetail.slider vào array imgSlider
          imgSlider.push({
            uid: uuidv4(),
            name: item,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
          });
        });
      }
      //setFileList cho component Upload(antd) bằng cách nối imgthumbnail vào copy array: imgSlider
      setFileList([imgThumbnail, ...imgSlider]);
    }
  }, [dataViewDetail]);

  const onclose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  return (
    <>
      <div>
        <Drawer
          title="Book description"
          width={"50vw"}
          open={openViewDetail}
          onClose={onclose}
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Id">
              {dataViewDetail?._id}
            </Descriptions.Item>
            <Descriptions.Item label="Name of book">
              {dataViewDetail?.mainText}
            </Descriptions.Item>
            <Descriptions.Item label="Author">
              {dataViewDetail?.author}
            </Descriptions.Item>
            <Descriptions.Item label="Price">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(dataViewDetail?.price ?? 0)}
            </Descriptions.Item>
            <Descriptions.Item label="Category" span={2}>
              <Badge status="processing" text={dataViewDetail?.category} />
            </Descriptions.Item>

            <Descriptions.Item label="Created At">
              {dayjs(dataViewDetail?.createdAt).format(FORMAT_DATE)}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {dayjs(dataViewDetail?.updatedAt).format(FORMAT_DATE)}
            </Descriptions.Item>
          </Descriptions>
          <Divider>Book images</Divider>
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            showUploadList={{ showRemoveIcon: false }}
          ></Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: "none" }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </Drawer>
      </div>
    </>
  );
};

export default DetailBook;
