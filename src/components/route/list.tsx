import React from 'react'
//@ts-ignore
import { List, Datagrid,DateField, TextField,TextInput,EditButton,ShowButton,Filter,DeleteButton } from "react-admin";
export const ListCompoent = (props: JSX.IntrinsicAttributes) => {
  return (
    <List {...props} filters={<MyFilter />}>
      <Datagrid>
        <TextField source="id" label="序号" />
        <TextField source="name" label="路线名称" />
        <RoutePathFormat source="path_json" label="路径点" />
        <DateField source="created_at" label="创建日期" />
        <TextField source="comment" label="路线说明" />
        <EditButton label="编辑" />
        <ShowButton label="查看详情"/>
        <DeleteButton label="删除"/>
      </Datagrid>
    </List>
  )
}
const RoutePathFormat = (props:any) => {
  let pathJson = JSON.parse(props.record.path_json)
  return <span>
    {pathJson.map((item: { keyword: any; },index:number)=>{
      if(index === pathJson.length -1 )
        return `${item.keyword}`
      return `${item.keyword}->`
    })}
  </span>
}
const MyFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="查询路线" source="name" alwaysOn />
  </Filter>
);