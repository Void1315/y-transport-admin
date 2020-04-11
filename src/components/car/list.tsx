import React from 'react'
//@ts-ignore
import { List, Datagrid, TextField,TextInput,EditButton,ShowButton,Filter,DeleteButton } from "react-admin";
const CarListCompoent:React.FC<any> = (props) => {
  return (
    <List title={"编辑车辆信息"} {...props} filters={<MyFilter />}>
      <Datagrid>
        <TextField source="id" label="序号" />
        <TextField source="number" label="车牌号" />
        <TextField source="phone" label="车辆联系方式" />
        <TextField source="capacity" label="车辆最大载客量" />
        <EditButton label="编辑" />
        <ShowButton label="查看详情"/>
        <DeleteButton label="删除"/>
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