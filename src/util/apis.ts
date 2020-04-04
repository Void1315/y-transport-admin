import Fetch from './fetch';
import {Urls} from './urls'
// login 登录接口
const login = (data:{user:string,password:string}) => Fetch.post(Urls.login,data);
// 退出接口
const logout = () => Fetch.get(Urls.logout);
export default {
  login,
  logout 
}
