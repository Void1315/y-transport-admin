
import React from 'react'
import API from '../../util/apis'
import {tokenCheck} from '../../util/token'
// @ts-ignore
import { Admin,Resource,AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from "react-admin";
import RouteCompoent from '../../components/route'
import jsonServerProvider from "ra-data-json-server";
const dataProvider = jsonServerProvider("http://jsonplaceholder.typicode.com");
const HomePage = () => {
  return (
    <Admin authProvider={authProvider} dataProvider={dataProvider}>
      <Resource name="posts" list={RouteCompoent} />
      {/* <Route exact path={`${path}route`} component={RouteCompoent}/> */}
    </Admin>
  )
}
// const authProvider =  (type: any, params: { username?: any; status?: any; }) => {
//   // called when the user attempts to log in
//   if (type === AUTH_LOGIN) {
//     const { username } = params;
//     localStorage.setItem("username", username);
//     // accept all username/password combinations
//     return Promise.resolve();
//   }
//   // called when the user clicks on the logout button
//   if (type === AUTH_LOGOUT) {
//     localStorage.removeItem("username");
//     return Promise.resolve();
//   }
//   // called when the API returns an error
//   if (type === AUTH_ERROR) {
//     const { status } = params;
//     if (status === 401 || status === 403) {
//       localStorage.removeItem("username");
//       return Promise.reject();
//     }
//     return Promise.resolve();
//   }
//   // called when the user navigates to a new location
//   if (type === AUTH_CHECK) {
//     return localStorage.getItem("username")
//       ? Promise.resolve()
//       : Promise.reject();
//   }
//   return Promise.reject("Unknown method");
// };
const authProvider = {
  login: async (params: {username:string,password:string}) =>  {
    const { username, password } = params;
    return API.login({user:username,password}).then(data=>{
      return Promise.resolve()
    }).catch(err=>{
      return Promise.reject(err);
    })
  },
  logout: () => {
    console.log("退出!")
    console.trace();
    // return API.logout().then(data=>Promise.resolve()).catch(err=>Promise.reject(err))
  },
  checkAuth: (params: any) => {
    console.log("检测!",tokenCheck())
    return tokenCheck()
      ? Promise.resolve()
      : Promise.reject();
  },
  checkError: (error: any) => {
    console.log("错误!")
    if (error === 401 || error === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getPermissions: (params: any) => Promise.resolve(),
};
export default HomePage;