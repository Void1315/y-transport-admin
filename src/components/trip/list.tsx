import React from 'react'
import {Chip} from '@material-ui/core';
//@ts-ignore
import { List, Datagrid,DateField, TextField,TextInput,Filter } from "react-admin";
import {OptionButtonGroup} from '../options'
const TripListCompoent = (props: JSX.IntrinsicAttributes) => {
  return (
    <List {...props} filters={<MyFilter />}>
      <Datagrid>
        <TextField source="id" label="序号" />
        <TextField source="name" label="车次名称" />
        <TypeFormat source="type" label="车次状态" />
        <TextField source="car.name" label="关联车辆" />
        <TextField source="start_time" label="出票时间" />
        <TextField source="end_time" label="结束出票时间" />
        <DateField source="created_at" label="创建日期" />
        <DateField source="updated_at" label="修改日期" />
        <OptionButtonGroup source="trip" name="车次" label="操作" />
      </Datagrid>
    </List>
  )
}
const TypeFormat = (props:any) => {
  console.log('record',props.record)
  return (
    <Chip label={props.record.type==0?'未启用':'已启用'} color={props.record.type==0?'secondary':'primary'}size="small" />
  )
}
const MyFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="查询车次名称" source="name" alwaysOn />
  </Filter>
);
export default TripListCompoent;