import { DeleteTwoTone, EditTwoTone, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, Space, Tag } from "antd";
import { useRef, useState } from "react";
import { fetchUserAPI } from "../../../services/api";
import { dateRangeValidate } from "../../../services/helper";

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
          <EditTwoTone style={{ marginRight: "15px" }} />
          <DeleteTwoTone />
        </>
      );
    },
  }, //vì object này chỉ render ra 2 icon phục vụ cho việc sửa và xóa user nên không cần thuộc tính(dataIndex: )
];

//type TSearch định nghĩa 4 trường dùng để tìm kiếm user cho params của TableUser
type TSearch = {
  fullName: string;
  email: string;
  createdAt: string;
  createdAtRange: string;
};

const TableUser = () => {
  const actionRef = useRef<ActionType>();

  //state meta sẽ lưu 1 đối tượng chứa các thông tin như: current, pageSize,... phục vụ cho việc phân trang table user
  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 2,
    total: 8,
  });
  return (
    <>
      {/* Table user phải kế thừa interface: IUserTable */}
      <ProTable<IUserTable, TSearch>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        //thuộc tính request của table user phụ trách việc call api lấy dữ liệu cho table
        request={async (params, sort, filter) => {
          //loading 1s trước khi gọi api lấy dữ liệu user
          await waitTime(1000);

          //params là 1 object và mặc định có các thuộc tính như:params.current, params.pageSize, params.keyword
          //params sẽ có thêm các thuộc tính trong trường dataIndex của columns(params.email, params.fullName) nếu không có trường hideInSearch: true
          console.log("check params: ", params);

          let query = "";
          //nếu có params(params !== null or undefine)
          if (params) {
            //nối chuỗi query với params.current và params.pageSize để lấy các user ở page = params.current và số lượng user trên page: params.pageSize
            query += `current=${params.current}&pageSize=${params.pageSize}`;
            if (params.email) {
              //nối chuỗi query với params.email trong trường hợp admin tìm kiếm user by email
              query += `&email=/${params.email}/i`;
            }
            //tương tự với email
            if (params.fullName) {
              query += `&fullName=/${params.fullName}/i`;
            }

            //format các date trong params.createdAtRange(là 1 array chứa 2 thông tin createdDate và endDate admin nhập để tìm user by created date)
            const createDateRange = dateRangeValidate(params.createdAtRange);
            console.log("check createDateRange: ", createDateRange);
            if (createDateRange) {
              //nối chuỗi query với createDateRange đã format
              query += `&createdAt>=${createDateRange[0]}&createdAt<=${createDateRange[1]}`;
            }
          }
          console.log("check query: ", query);

          const res = await fetchUserAPI(query); //call api lấy dữ liệu user cho table với query
          if (res.data?.meta) {
            setMeta(res.data.meta);
          }
          //return 1 đối tượng(chứa data các user từ api và các thuộc tính khác: page, total,...) để fill dữ liệu cho table user
          return {
            data: res.data?.result as any,
            page: 1,
            success: true,
            total: res.data?.meta.total,
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
              actionRef.current?.reload();
            }}
            type="primary"
          >
            Add new user
          </Button>,
        ]}
        rowKey="_id"
      />
    </>
  );
};

export default TableUser;
