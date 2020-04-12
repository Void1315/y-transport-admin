import React from 'react'
//@ts-ignore
import { List, Datagrid,DateField, TextField,TextInput,SelectField,Filter } from "react-admin";
import {OptionButtonGroup} from '../options'
import {MAP_POLICY } from '../../util/config'
export const ListCompoent = (props: JSX.IntrinsicAttributes) => {
  return (
    <List {...props} filters={<MyFilter />}>
      <Datagrid>
        <TextField source="id" label="序号" />
        <TextField source="name" label="路线名称" />
        <SelectField label="路线类型" source="type" choices={Object.values(MAP_POLICY).map((item:string,index:number)=>{
          return {id:index,name:item}
        })} />
        <RoutePathFormat source="path_json" label="路径点" />
        <DateField source="created_at" label="创建日期" />
        <TextField source="comment" label="路线说明" />
        <OptionButtonGroup source="routes_data" name="路线" label="操作" />
      </Datagrid>
    </List>
  )
}
const RoutePathFormat = (props:any) => {
  let pathJson = []
  try{
    pathJson  = JSON.parse(props.record.path_json)
  }catch{
    pathJson=[]
  }
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