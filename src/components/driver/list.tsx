import React from 'react'
import {OptionButtonGroup} from '../options'
//@ts-ignore
import { List, Datagrid, TextField,TextInput,EditButton,ShowButton,Filter,DeleteButton } from "react-admin";
const DriverListCompoent:React.FC<any> = (props) => {
  return (
    <List {...props} filters={<MyFilter />}>
      <Datagrid>
        <TextField source="id" label="序号" />
        <TextField source="name" label="司机名称" />
        <TextField source="age" label="司机年龄" />
        <TextField source="driving_age" label="司机驾龄" />
        <TextField source="phone" label="司机联系方式" />
        <OptionButtonGroup source="driver" name="路线" label="操作" />
      </Datagrid>
    </List>
  )
}
const MyFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="查询司机名称" source="name" alwaysOn />
  </Filter>
);
export default DriverListCompoent