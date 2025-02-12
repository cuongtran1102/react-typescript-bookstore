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
export { loginAPI, registerAPI };
