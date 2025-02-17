import dayjs from "dayjs"; //sử dụng thư viện dayjs để format date

export const FORMAT_DATE = "YYYY-MM-DD"; //kiểu format: YYYY-MM-DD

//hàm dateRangeValidate truyền vào 1 array(dateRange) kiểu string chứa các chuỗi lưu trữ date
export const dateRangeValidate = (dateRange: any) => {
  if (!dateRange) return undefined;

  const startDate = dayjs(dateRange[0], FORMAT_DATE).toDate(); //startDate: phần tử date đầu tiên của dateRange
  const endDate = dayjs(dateRange[1], FORMAT_DATE).toDate(); //endDate: phần tử date thứ 2 của dateRange

  return [startDate, endDate]; //return 1 aray chứa startDate và endDate đã format và convert sang kiểu date
};
