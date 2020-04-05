
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
    return API.logout().then(data=>Promise.resolve()).catch(err=>Promise.reject(err))
  },
  checkAuth: () => {
    return tokenCheck()
      ? Promise.resolve()
      : Promise.reject();
  },
  checkError: (error: any) => {
    if (error === 401 || error === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getPermissions: (params: any) => Promise.resolve(),
};
export default HomePage;