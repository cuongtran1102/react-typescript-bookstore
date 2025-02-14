import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, //đảm bảo rằng các request sẽ gửi kèm và cho phép nhận cookie từ server
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    //truyền access_token vào Headers trước khi gửi request xuống backend
    config.headers.Authorization = `Bearer ${localStorage.getItem(
      "access_token"
    )}`; //lấy access_token từ localStorage và config access_token theo chuẩn Bearer
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Do something with response data

    if (response?.data) {
      return response.data;
    }
    return response;
  },
  function (error) {
    // Do something with response error
    if (error?.response?.data) {
      return error.response.data;
    }
    return Promise.reject(error);
  }
);

export default instance;
