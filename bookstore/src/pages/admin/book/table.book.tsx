import {
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, Popconfirm } from "antd";
import { useRef, useState } from "react";
import { fetchBookAPI } from "../../../services/api";
import { CSVLink } from "react-csv";
import DetailBook from "./detail.book";

type TSearch = {
  mainText: string;
  author: string;
  createdAt: string;
  createdAtRange: string;
  updatedAt: string;
  updatedAtRange: string;
  price: number;
};

const TableBook = () => {
  const actionRef = useRef<ActionType>();

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0,
  });

  const [dataViewDetail, setDataViewDetail] = useState<IBook | null>(null);
  const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

  const refreshTable = () => {
    actionRef.current?.reload();
  };

  const columns: ProColumns<IBook>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "ID",
      dataIndex: "_id",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <>
            <a
              href="#"
              onClick={() => {
                setOpenViewDetail(true);
                setDataViewDetail(entity);
              }}
            >
              {entity._id}
            </a>
          </>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "mainText",
    },
    {
      title: "Category",
      dataIndex: "category",
      hideInSearch: true,
    },
    {
      title: "Author",
      dataIndex: "author",
    },
    {
      title: "Price",
      dataIndex: "price",
      hideInSearch: true,
      sorter: true,
      render(dom, entity, index, action, schema) {
        return (
          <>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(entity.price)}
          </>
        );
      },
    },
    {
      title: "Create at",
      dataIndex: "createdAt",
      hideInSearch: true,
      sorter: true,
      valueType: "date",
    },
    {
      title: "Action",
      hideInSearch: true,
      render(dom, entity, index, action, schema) {
        return (
          <>
            <EditTwoTone onClick={() => {}} style={{ marginRight: "15px" }} />
            {/* sử dụng component Popconfirm để delete user */}
            <Popconfirm
              title="Delete the user"
              description="Are you sure to delete this user?"
              onConfirm={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <DeleteTwoTone />
            </Popconfirm>
          </>
        );
      },
    },
  ];
  return (
    <>
      <div>
        <ProTable<IBook, TSearch>
          columns={columns}
          actionRef={actionRef}
          cardBordered
          headerTitle="Table book"
          dateFormatter="string"
          request={async (params, sort, filter) => {
            const queryParams = new URLSearchParams();

            //paginate
            queryParams.append("current", String(params.current || 1));
            queryParams.append("pageSize", String(params.pageSize || 5));

            // Search Filters
            if (params?.mainText)
              queryParams.append("mainText", `/${params.mainText}/i`);
            if (params?.author)
              queryParams.append("author", `/${params.author}/i`);

            // Sorting
            const sortPrice = sort?.price ?? "descend";
            queryParams.append(
              "sort",
              sortPrice === "ascend" ? "price" : "-price"
            );
            console.log("check sortField: ", sortPrice);
            const sortCreatedAt = sort?.createdAt ?? "descend";
            queryParams.append(
              "sort",
              sortCreatedAt === "ascend" ? "createdAt" : "-createdAt"
            );

            const res = await fetchBookAPI(queryParams.toString());
            if (res.data?.meta) {
              setMeta(res.data.meta);
            }
            return {
              data: res.data?.result,
              page: 1,
              success: true,
              total: res.data?.meta.total,
            };
          }}
          pagination={{
            current: meta.current,
            pageSize: meta.pageSize,
            total: meta.total,
          }}
          toolBarRender={() => [
            <Button
              key="button"
              icon={<PlusOutlined />}
              onClick={() => {
                // setOpenModalCreate(true); //mở modal create user khi click vào button add
              }}
              type="primary"
            >
              Add new book
            </Button>,

            <Button icon={<ExportOutlined />} type="primary">
              {/* <CSVLink
                data={currentDataTable}
                filename="export-user-from-table.csv"
              > */}
              Export file
              {/* </CSVLink> */}
            </Button>,
          ]}
          rowKey="_id"
        />
        <DetailBook
          dataViewDetail={dataViewDetail}
          setDataViewDetail={setDataViewDetail}
          openViewDetail={openViewDetail}
          setOpenViewDetail={setOpenViewDetail}
        />
      </div>
    </>
  );
};

export default TableBook;
