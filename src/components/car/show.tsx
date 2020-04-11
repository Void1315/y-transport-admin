import React from 'react'
//@ts-ignore
import { Show, SimpleShowLayout, TextField, ImageInput, EditButton, ImageField,ListButton,DeleteButton,RefreshButton  } from 'react-admin';
import {CardActions} from '@material-ui/core';
const CarShowCompoent:React.FC<any> = (props) => {
  return (
    <Show title="车辆" {...props} actions={<PostShowActions {...props} />}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField label="车辆名称" source="name" />
        {/* <ImageInput source="image" maxSize={20000000} placeholder={<p>拖拽照片到此处</p>} label="上传司机照片" accept="image/*"> */}
        <ImageField source="image.image" src="path" title="title" />
        {/* </ImageInput> */}
        {/* <TextField label="司机名称" source="name" />
        <TextField label="司机联系方式" source="phone" />
        <TextField label="司机年龄" source="age" />
        <TextField label="司机驾龄" source="driving_age" />
        <DateField label="创建时间" source="created_at" />
        <DateField label="最后更新时间" source="updated_at" /> */}
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
export default CarShowCompoent