import React from 'react'
import {OptionButtonGroup} from '../options'
//@ts-ignore
import { List, Datagrid, TextField,TextInput,EditButton,ShowButton,Filter,DeleteButton } from "react-admin";
const CarListCompoent:React.FC<any> = (props) => {
  return (
    <List title={"编辑车辆信息"} {...props} filters={<MyFilter />}>
      <Datagrid>
        <TextField source="id" label="序号" />
        <TextField source="name" label="车辆名称" />
        <TextField source="number" label="车牌号" />
        <TextField source="phone" label="车辆联系方式" />
        <TextField source="capacity" label="车辆最大载客量" />
        <OptionButtonGroup label="操作" source="car" name="车辆" />
      </Datagrid>
    </List>
  )
}
const MyFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="查询车辆名称" source="name" alwaysOn />
  </Filter>
);
export default CarListCompoent