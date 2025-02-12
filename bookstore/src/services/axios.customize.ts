import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
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
