import React from 'react'
//@ts-ignore
import { Show, SimpleShowLayout, TextField, SelectField, EditButton,DateField, ImageField,ListButton,DeleteButton,RefreshButton  } from 'react-admin';
import {CardActions} from '@material-ui/core';
const CarShowCompoent:React.FC<any> = (props) => {
  return (
    <Show title="车辆" {...props} actions={<PostShowActions {...props} />}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField label="车辆名称" source="name" />
        <ImageField label="车辆照片" source="image.image" src="path" title="title" />
        <TextField label="车辆联系方式" source="phone" />
        <SelectField label="车辆类型" source="type" choices={[
          { id: 0, name: '座位' },
          { id: 1, name: '卧铺' },
        ]} />
        <TextField  label="车辆最大载客数" source="capacity" />
        <TextField label="车辆行驶路线" source="route.name" {...props}/>
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
export default CarShowCompoent