import React from 'react';
//@ts-ignore
import { Show, SimpleShowLayout, TextField, DateField, EditButton, SelectField,ListButton,DeleteButton,RefreshButton,useShowController  } from 'react-admin';
import {CardActions,CircularProgress} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles'
import {MAP_POLICY} from '../../util/config/index'
import style from './styles'
import {useAMap} from '../../util/hook'
const useStyle = makeStyles(style)
export const ShowCompoent = (props: JSX.IntrinsicAttributes) => {
  const {record} = useShowController(props)
  const [routerMap,setRouterMap] = React.useState<any>(null)
  const classes = useStyle()
  const mapCreate = (map:any,AMap:any) => {
    AMap.plugin(["AMap.Driving"],()=>{
      let r = new AMap.Driving({
        map,
      })
      setRouterMap(r)
    });
  }

  const {loading:mapLoading,el:mapEl,AMap,map} = useAMap({created:mapCreate})
  React.useEffect(()=>{
    if(AMap&&record&&routerMap){
      routerMap.setPolicy(record.policy)
      routerMap.search(JSON.parse(record.path_json))
    }
  },[AMap,record,routerMap])
  return (
    //@ts-ignore
    <Show title="路线" {...props} actions={<PostShowActions {...props} />}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField label="路线名称" source="name" />
        <TextField label="路线说明" multiline source="comment" />
        <SelectField label="路线类型" source="type" choices={Object.values(MAP_POLICY).map((item:string,index:number)=>{
          return {id:index,name:item}
        })} />
        <DateField label="创建时间" source="created_at" />
        <DateField label="最后更新时间" source="updated_at" />
        <div className={classes.mapBox}>
          {mapLoading && <CircularProgress />}
          {mapEl}
        </div>
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