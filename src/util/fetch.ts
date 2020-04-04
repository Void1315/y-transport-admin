import  axios  from 'axios';

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_HOST}/admin`,
});
// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if(response.data.code != 200){
    return Promise.reject(response.data.msg)
  }
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
export default instance;