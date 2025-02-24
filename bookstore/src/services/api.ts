import instance from "./axios.customize";

const loginAPI = async (username: string, password: string) => {
  let urlBackEnd = "/api/v1/auth/login";
  //sử dụng interface: IBackendRes, ILogin cho respone của loginAPI để respone có thể được gợi ý code cho các thuộc tính như: res.data, res.statusCode
  let res = await instance.post<IBackendRes<ILogin>>(urlBackEnd, {
    username,
    password,
  });
  return res;
};

const registerAPI = async (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  let urlBackEnd = "/api/v1/user/register";
  let res = await instance.post<IBackendRes<IRegister>>(urlBackEnd, {
    fullName,
    email,
    password,
    phone,
  });
  return res;
};

const fetchUserInfoAPI = async () => {
  const urlBackEnd = "/api/v1/auth/account";
  let res = await instance.get<IBackendRes<IUserData>>(urlBackEnd, {
    headers: {
      delay: 1000,
    },
  });
  return res;
};

const logoutAPI = async () => {
  const urlBackEnd = "/api/v1/auth/logout";
  let res = await instance.post<IBackendRes<string>>(urlBackEnd);
  return res;
};

const fetchUserAPI = async (query: string) => {
  const urlBackEnd = `/api/v1/user?${query}`;
  let res = await instance.get<IBackendRes<IModelPaginate<IUserTable>>>(
    urlBackEnd
  );
  return res;
};

const createUserAPI = async (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  const urlBackEnd = "/api/v1/user";
  let res = await instance.post<IBackendRes<string>>(urlBackEnd, {
    fullName,
    email,
    password,
    phone,
  });
  return res;
};

//tham số: dataImport của hàm importUserAPI là 1 array các object chứa thông tin user import từ file excel
const importUserAPI = async (
  dataImport: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
  }[]
) => {
  const urlBackEnd = "/api/v1/user/bulk-create";
  let res = await instance.post<IBackendRes<IResImport>>(
    urlBackEnd,
    dataImport
  );
  return res;
};
const updateUserAPI = async (_id: string, fullName: string, phone: string) => {
  const urlBackEnd = "/api/v1/user";
  let res = await instance.put<IBackendRes<any>>(urlBackEnd, {
    _id,
    fullName,
    phone,
  });
  return res;
};

const deleteUserAPI = async (_id: string) => {
  const urlBackEnd = `/api/v1/user/${_id}`;
  let res = await instance.delete<IBackendRes<any>>(urlBackEnd);
  return res;
};

const fetchBookAPI = async (query: string) => {
  const urlBackEnd = `/api/v1/book?${query}`;
  let res = await instance.get<IBackendRes<IModelPaginate<IBook>>>(urlBackEnd);
  return res;
};

export {
  loginAPI,
  registerAPI,
  fetchUserInfoAPI,
  logoutAPI,
  fetchUserAPI,
  createUserAPI,
  importUserAPI,
  updateUserAPI,
  deleteUserAPI,
  fetchBookAPI,
};
