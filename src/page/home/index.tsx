
import React from 'react'
import API from '../../util/apis'
import {tokenCheck} from '../../util/token'
// @ts-ignore
import { Admin,Resource } from "react-admin";
import {ListCompoent,ShowCompoent,CreateCompoent,EditCompoent} from '../../components/route'
import dataProvider from '../../util/dataProvider'
import {Map} from "@material-ui/icons";
const HomePage = () => {
  return (
    <Admin authProvider={authProvider} dataProvider={dataProvider} title="My Custom Admin">
      <Resource options={{ label: '路线' }} name="routes_data" list={ListCompoent} show={ShowCompoent} create={CreateCompoent}  icon={Map} />
      {/* <Resource name="posts" list={ListCompoent} /> */}
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