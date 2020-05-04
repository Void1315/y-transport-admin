import React from 'react';
//@ts-ignore
import { Show, SimpleShowLayout, TextField, DateField, EditButton, SelectField,ListButton,DeleteButton,RefreshButton,useShowController,Labeled  } from 'react-admin';
import {CardActions,CircularProgress,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles'
import {MAP_POLICY} from '../../util/config/index'
import style from './styles'
import {useAMap} from '../../util/hook'
//@ts-ignore
import _ from 'loadsh';
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
    if(AMap&&record.path_json&&routerMap){
      routerMap.setPolicy(record.policy)
      let _pathJson = _.cloneDeep(JSON.parse(record.path_json))
      const startPoint =  new AMap.LngLat(_pathJson[0].lng,_pathJson[0].lat) 
      const endPoint = new AMap.LngLat(_pathJson[_pathJson.length - 1].lng,_pathJson[_pathJson.length - 1].lat) 
      const opts = {waypoints:_pathJson.slice(1,-1).map((item: { lng: any; lat: any; })=>{
        return new AMap.LngLat(item.lng,item.lat)
      })}
      routerMap&&routerMap.search(startPoint,endPoint,opts)
    }
  },[AMap,record,routerMap])
  return (
    //@ts-ignore
    <Show title="路线" {...props} actions={<PostShowActions {...props} />}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField label="路线名称" source="name" />
        <TextField label="路线说明" multiline="true" source="comment" />
        <SelectField label="路线类型" source="type" choices={MAP_POLICY} />
        <ShowRouteTable addLabel label="路线详情" record={record}/>
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
interface IShowRouteTableProps{
  label?:string
  addLabel: true,
  record:any
}
const ShowRouteTable:React.FC<IShowRouteTableProps> = (props:IShowRouteTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell align="right">路径点名称</TableCell>
            <TableCell align="right">路径区域</TableCell>
            <TableCell align="right">到站时间</TableCell>
            <TableCell align="right">价格</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {JSON.parse(props.record.path_json).map((item:any) => (
            <TableRow key={item.id}>
              <TableCell component="th" scope="row">
                {item.id}
              </TableCell>
              <TableCell component="th" scope="row">
                {item.keyword}
              </TableCell>
              <TableCell align="right">{item.district}</TableCell>
              <TableCell align="right">{item.time}</TableCell>
              <TableCell align="right">{item.price?`${item.price} 元`:'-'} </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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