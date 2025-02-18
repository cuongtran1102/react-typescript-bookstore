import { Avatar, Badge, Descriptions, Drawer } from "antd";
import dayjs from "dayjs";
import { FORMAT_DATE } from "../../../services/helper";

//khai báo interface cho các props của component DetailUser
interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (openViewDetail: boolean) => void;
  dataViewDetail: IUserTable | null;
  setDataViewDetail: (dataViewDetail: IUserTable | null) => void;
}

const DetailUser = (props: IProps) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  //lấy url avatar user
  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    dataViewDetail?.avatar
  }`;

  return (
    <>
      <div>
        <Drawer
          title="User description"
          width={"50vw"}
          open={openViewDetail}
          onClose={onClose}
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Id">
              {dataViewDetail?._id}
            </Descriptions.Item>
            <Descriptions.Item label="Full name">
              {dataViewDetail?.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {dataViewDetail?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {dataViewDetail?.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Role">
              <Badge status="processing" text={dataViewDetail?.role} />
            </Descriptions.Item>
            <Descriptions.Item label="Avatar">
              <Avatar size={40} src={urlAvatar} alt="No Avatar" />
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {dayjs(dataViewDetail?.createdAt).format(FORMAT_DATE)}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {dayjs(dataViewDetail?.updatedAt).format(FORMAT_DATE)}
            </Descriptions.Item>
          </Descriptions>
        </Drawer>
      </div>
    </>
  );
};

export default DetailUser;
