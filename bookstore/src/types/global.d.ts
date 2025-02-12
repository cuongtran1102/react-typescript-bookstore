//2 dòng code: export {}; và declare global {...} để cho các interface: IBackendRes, IModelPaginate dùng được mọi nơi trong project mà ko phải import
export {};
declare global {
  interface IBackendRes<T> {
    //dấu ?(error?) có nghĩa là thuộc tính error là optional(có thể có hoặc ko)
    error?: string | string[]; //thuộc tính error có thể là 1 string hoặc mảng các string
    message: string;
    statusCode: number | string;
    data?: T; //T là một tham số kiểu generics, cho phép interface được sử dụng với các kiểu dữ liệu khác nhau.
    //khai báo(data: T): data sẽ là kiểu generics từ đó cho phép truyền interface ILogin vào data khi khai báo: <IBackendRes<ILogin>>
    //từ đó interface IBackendRes có thể sử dụng các thuộc tính của interface ILogin như: access_token, user. vd: res.data.access_token
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    results: T[]; //result có kiểu là 1 array các generics(T)
  }
  interface ILogin {
    access_token: string;
    user: {
      email: string;
      phone: string;
      fullName: string;
      role: string;
      avatar: string;
      id: string;
    };
  }

  interface IRegister {
    _user: {
      _id: string;
      email: string;
      fullName: string;
    };
  }
}
