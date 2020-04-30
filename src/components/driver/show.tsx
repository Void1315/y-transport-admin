import React from 'react'
//@ts-ignore
import { Show, SimpleShowLayout, TextField, DateField, EditButton, ImageField,ListButton,DeleteButton,RefreshButton  } from 'react-admin';
import {CardActions} from '@material-ui/core';
const DriverShowCompoent:React.FC<any> = (props) => {
  return (
    <Show title="司机" {...props} actions={<PostShowActions {...props} />}>
      <SimpleShowLayout>
        <TextField source="id" />
        <ImageField label="司机照片" source="image" />
        <TextField label="司机名称" source="name" />
        <TextField label="司机联系方式" source="phone" />
        <TextField label="司机年龄" source="age" />
        <TextField label="司机驾龄" source="driving_age" />
        <DateField label="创建时间" source="created_at" />
        <DateField label="最后更新时间" source="updated_at" />
      </SimpleShowLayout>
    </Show>
  )
}
const PostShowActions = (props: { basePath: any; id:any, resource: any; }) => (
  <CardActions>
    <EditButton label="编辑" basePath={props.basePath} record={{id:props.id}}/>
    <ListButton label="列表" basePath={props.basePath} />
    <DeleteButton label="删除" basePath={props.basePath} record={{id:props.id}} resource={props.resource} />
    <RefreshButton label="刷新" />
  </CardActions>
);
export default DriverShowCompoent