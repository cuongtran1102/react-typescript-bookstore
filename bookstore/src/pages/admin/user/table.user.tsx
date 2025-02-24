import {
  CloudUploadOutlined,
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Button, Popconfirm, App } from "antd";
import { useRef, useState } from "react";
import { deleteUserAPI, fetchUserAPI } from "../../../services/api";
import { dateRangeValidate } from "../../../services/helper";
import DetailUser from "./detail.user";
import CreateUserModal from "./create.user";
import ImportUser from "./import.user";
import { CSVLink } from "react-csv";
import UpdateUser from "./update.user";

//hàm tạo hiệu ứng loadding khi lấy dữ liệu user từ api cho table user
const waitTimePromise = async (time: number = 100) => {
  //return 1 Promise để khi hết thơi gian(time) Promise sẽ resolve
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

//sử dụng hàm waitTimePromise
const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};

//type TSearch định nghĩa 4 trường dùng để tìm kiếm user cho params của TableUser
type TSearch = {
  fullName: string;
  email: string;
  createdAt: string;
  createdAtRange: string;
};

const TableUser = () => {
  const actionRef = useRef<ActionType>();

  //các state dùng để open drawer thông tin user và set thông tin user cho drawer
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
  const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);

  //state để open model tạo mới user
  const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

  //state để open model import user bằng file excel
  const [openModalImport, setOpenModalImport] = useState<boolean>(false);

  //state để lưu trữ các user đang hiển thị trên table user(khi export fiel csv dẽ chỉ lưu thông tin các user đang hiển thị trên table)
  const [currentDataTable, setCurrentDataTable] = useState<IUserTable[]>([]);

  const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);

  const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);

  //state meta sẽ lưu 1 đối tượng chứa các thông tin như: current, pageSize,... phục vụ cho việc phân trang table user
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });

  //state lưu trang thái loading khi click button delete user
  const [deleteUser, setDeleteUser] = useState<boolean>(false);

  const { message, notification } = App.useApp();

  //hàm delete user
  const handleDeleteUser = async (_id: string) => {
    setDeleteUser(true);
    //gọi api delete user
    let res = await deleteUserAPI(_id);
    if (res?.data) {
      message.success("Delete user success");
      refreshTable(); //refresh table user sau khi delete user
    } else {
      notification.error({
        message: "Delete user error!",
        description: res.message,
      });
    }
    setDeleteUser(false);
  };

  //columns: 1 aray chứa các object, mỗi object định nghĩa các cột cho table
  //mỗi object thuộc aray columns có kiểu ProColumns và kế thừa interface: IUserTable(interface chứa thông tin user)
  const columns: ProColumns<IUserTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    }, //object này có dataIndex: "index"(dùng để tạo border cho table)
    {
      title: "ID",
      dataIndex: "_id",
      hideInSearch: true, //thuộc tính(hideInSearch: true) có nghĩa là kho có thanh tìm kiếm cho cột id
      render(dom, entity, index, action, schema) {
        return (
          <>
            <a
              href="#"
              onClick={() => {
                //khi click vào id user trên table user sẽ mở drawer và truyền thông tin user cho drawer
                setOpenViewDetail(true);
                setDataViewDetail(entity); //entity đại diện cho thông tin 1 user
              }}
            >
              {entity._id}
            </a>
          </>
        );
      },
    }, //object này có dataIndex: "_id"(thuộc tính id của interface: IUserTable)
    {
      title: "Full name",
      dataIndex: "fullName",
    }, //object này có dataIndex: "fullName"(thuộc tính fullName của interface: IUserTable)
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
    }, //tương tự
    {
      title: "Phone",
      dataIndex: "phone",
      hideInSearch: true,
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      hideInSearch: true,
      valueType: "date",
      sorter: true,
    },
    {
      title: "Created at",
      dataIndex: "createdAtRange",
      valueType: "dateRange",
      hideInTable: true,
    },
    {
      title: "Action",
      hideInSearch: true,
      //hàm render dùng để render các html element trong 1 cột của antd pro table(trong TH này render ra 2 icon delete và edit)
      render(dom, entity, index, action, schema) {
        return (
          <>
            <EditTwoTone
              onClick={() => {
                setOpenModalUpdate(true);
                setDataUpdate(entity);
              }}
              style={{ marginRight: "15px" }}
            />
            {/* sử dụng component Popconfirm để delete user */}
            <Popconfirm
              title="Delete the user"
              description="Are you sure to delete this user?"
              onConfirm={() => {
                handleDeleteUser(entity._id); //gọi hàm delete user ở onConfirm
              }}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: deleteUser }} //thiết lập trạng thái loading cho button delete
            >
              <DeleteTwoTone />
            </Popconfirm>
          </>
        );
      },
    }, //vì object này chỉ render ra 2 icon phục vụ cho việc sửa và xóa user nên không cần thuộc tính(dataIndex: )
  ];

  //hàm này để reload lại table khi thêm mới 1 user
  const refreshTable = () => {
    actionRef.current?.reload(); //sử dụng useRef của react và ActionType của antd để reload table
  };

  return (
    <>
      <div>
        {/* Table user phải kế thừa interface: IUserTable */}
        <ProTable<IUserTable, TSearch>
          columns={columns}
          actionRef={actionRef}
          cardBordered
          //thuộc tính request của table user phụ trách việc call api lấy dữ liệu cho table
          request={async (params, sort, filter) => {
            //-----------------------------------code cũ--------------------------------------//
            //   //loading 1s trước khi gọi api lấy dữ liệu user
            //   await waitTime(1000);

            //   //params là 1 object và mặc định có các thuộc tính như:params.current, params.pageSize, params.keyword
            //   //params sẽ có thêm các thuộc tính trong trường dataIndex của columns(params.email, params.fullName) nếu không có trường hideInSearch: true

            //   let query = "";
            //   //nếu có params(params !== null or undefine)
            //   if (params) {
            //     //nối chuỗi query với params.current và params.pageSize để lấy các user ở page = params.current và số lượng user trên page: params.pageSize
            //     query += `current=${params.current}&pageSize=${params.pageSize}`;
            //     if (params.email) {
            //       //nối chuỗi query với params.email trong trường hợp admin tìm kiếm user by email
            //       query += `&email=/${params.email}/i`;
            //     }
            //     //tương tự với email
            //     if (params.fullName) {
            //       query += `&fullName=/${params.fullName}/i`;
            //     }

            //     //format các date trong params.createdAtRange(là 1 array chứa 2 thông tin createdDate và endDate admin nhập để tìm user by created date)
            //     const createDateRange = dateRangeValidate(params.createdAtRange);

            //     if (createDateRange) {
            //       //nối chuỗi query với createDateRange đã format
            //       query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
            //     }

            //     if (sort?.createdAt) {
            //       if (sort.createdAt === "ascend") {
            //         query += "&sort=createdAt";
            //       } else {
            //         query += "&sort=-createdAt";
            //       }
            //     } else {
            //       query += "&sort=-createdAt"; //mặc định sẽ sort user theo ngày tạo mới nhất
            //     }
            //   }

            //   const res = await fetchUserAPI(query); //call api lấy dữ liệu user cho table với query
            //   if (res.data?.meta) {
            //     setMeta(res.data.meta);

            //     setCurrentDataTable(res.data?.result ?? []);
            //     console.log("current data table: ", currentDataTable);
            //   }
            //   //return 1 đối tượng(chứa data các user từ api và các thuộc tính khác: page, total,...) để fill dữ liệu cho table user
            //   return {
            //     data: res.data?.result as any,
            //     page: 1,
            //     success: true,
            //     total: res.data?.meta.total,
            //   };
            // }

            //------------------tối ưu code cho request của antd pro table--------------------//
            await waitTime(1000); // Simulate loading time

            const queryParams = new URLSearchParams();

            // Pagination
            queryParams.append("current", String(params?.current || 1));
            queryParams.append("pageSize", String(params?.pageSize || 5));

            // Search Filters
            if (params?.email)
              queryParams.append("email", `/${params.email}/i`);
            if (params?.fullName)
              queryParams.append("fullName", `/${params.fullName}/i`);

            // Date Range Filter
            const createDateRange = dateRangeValidate(params?.createdAtRange);
            if (createDateRange) {
              queryParams.append("createdAt>=", createDateRange[0].toString());
              queryParams.append("createdAt<=", createDateRange[1].toString());
            }

            // Sorting
            const sortField = sort?.createdAt;
            queryParams.append(
              "sort",
              sortField === "ascend" ? "createdAt" : "-createdAt"
            );

            // Fetch API
            const res = await fetchUserAPI(queryParams.toString());

            if (res.data?.meta) {
              setMeta(res.data.meta);
              setCurrentDataTable(res.data?.result ?? []);
              console.log("current data table: ", currentDataTable);
            }

            console.log("check params: ", params);
            console.log("check queryParams: ", queryParams.toString());
            return {
              data: res.data?.result || [],
              page: params?.current || 1,
              success: true,
              total: res.data?.meta?.total || 0,
            };
          }}
          //thuộc tính pagination dùng để phân trang cho table user
          //truyền 1 object chứa các thông tin phân trang(current, pagesize, total, ...) cho pagination
          pagination={{
            current: meta.current,
            pageSize: meta.pageSize,
            total: meta.total,
          }}
          dateFormatter="string"
          headerTitle="Table user"
          toolBarRender={() => [
            <Button
              key="button"
              icon={<PlusOutlined />}
              onClick={() => {
                setOpenModalCreate(true); //mở modal create user khi click vào button add
              }}
              type="primary"
            >
              Add new user
            </Button>,
            <Button
              icon={<CloudUploadOutlined />}
              onClick={() => {
                setOpenModalImport(true); //mở modal import user khi click vào button import
              }}
              type="primary"
            >
              Import file
            </Button>,
            <Button icon={<ExportOutlined />} type="primary">
              <CSVLink
                data={currentDataTable}
                filename="export-user-from-table.csv"
              >
                Export file
              </CSVLink>
            </Button>,
          ]}
          rowKey="_id"
        />
        {/* truyền các props cho component: DetailUser(drawer thông tin user) */}
        <DetailUser
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
          dataViewDetail={dataViewDetail}
          setDataViewDetail={setDataViewDetail}
        />
        {/* truyền các props cho component: CreateUserModal(modal thêm user) */}
        <CreateUserModal
          openModalCreate={openModalCreate}
          setOpenModalCreate={setOpenModalCreate}
          refreshTable={refreshTable}
        />
        {/* truyền các props cho component: ImportUser(modal import user) */}
        <ImportUser
          openModalImport={openModalImport}
          setOpenModalImport={setOpenModalImport}
          refreshTable={refreshTable}
        />
        {/* truyền các props cho component: Update(modal update user) */}
        <UpdateUser
          dataUpdate={dataUpdate}
          setDataUpdate={setDataUpdate}
          openModalUpdate={openModalUpdate}
          setOpenModalUpdate={setOpenModalUpdate}
          refreshTable={refreshTable}
        />
      </div>
    </>
  );
};

export default TableUser;
