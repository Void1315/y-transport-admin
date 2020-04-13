
import React from 'react'
import API from '../../util/apis'
import {tokenCheck} from '../../util/token'
//@ts-ignore
import chineseMessages from 'yhy-ra-language-chinese';
// @ts-ignore
import { Admin,Resource,AppBar,Layout } from "react-admin";
import {ListCompoent,ShowCompoent,CreateCompoent,EditCompoent} from '../../components/route'
import {DriverListCompoent,DriverCreactCompoent,DriverShowCompoent,DriverEditCompoent} from '../../components/driver'
import {CarListCompoent,CarCreateCompoent,CarEditCompoent,CarShowCompoent } from '../../components/car'
import dataProvider from '../../util/dataProvider'
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import zhLocale from "date-fns/locale/zh-CN";
// import MomentUtils from '@date-io/moment';
import DateFnsUtils from '@date-io/date-fns'; 
import {Map,AirlineSeatReclineNormal,DirectionsBus,ConfirmationNumber} from "@material-ui/icons";
import { createMuiTheme } from '@material-ui/core/styles';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import {TripListCompoent,TripCreatCompoent,TripEditCompoent} from '../../components/trip'
const i18nProvider = polyglotI18nProvider(() => chineseMessages, 'cn');
const theme = createMuiTheme({
  palette: {
    type: 'light',
  },
});
const MyAppBar = (props:any) => {
  return (
    <AppBar color="primary" {...props}>
    </AppBar>
  )
}
const MyLayout = (props:any) => <Layout
  {...props}
  appBar={MyAppBar}
/>;
const HomePage = () => {
  return (
    <MuiPickersUtilsProvider locale={zhLocale} utils={DateFnsUtils}>
      <Admin i18nProvider={i18nProvider} layout={MyLayout} theme={theme} authProvider={authProvider} dataProvider={dataProvider}>
        <Resource options={{ label: '路线' }} name="routes_data" edit={EditCompoent} list={ListCompoent} show={ShowCompoent} create={CreateCompoent}  icon={Map} />
        <Resource options={{ label: '司机管理' }} show={DriverShowCompoent} edit={DriverEditCompoent} create={DriverCreactCompoent} name="driver" list={DriverListCompoent} icon={AirlineSeatReclineNormal} />
        <Resource options={{ label: '车辆管理' }} show={CarShowCompoent} create={CarCreateCompoent} edit={CarEditCompoent} name="car" list={CarListCompoent} icon={DirectionsBus} />
        <Resource options={{ label: '车次' }} list={TripListCompoent} edit={TripEditCompoent} create={TripCreatCompoent} name="trip" icon={ConfirmationNumber} />
      </Admin>
    </MuiPickersUtilsProvider>
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