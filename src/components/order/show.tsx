/*
 * @Author: asahi 
 * @Date: 2020-04-30 18:39:12 
 * @Last Modified by: asahi
 * @Last Modified time: 2020-04-30 18:42:25
 */
import React from 'react'
//@ts-ignore
import { Show, SimpleShowLayout, TextField, DateField, EditButton, ImageField,ListButton,DeleteButton,RefreshButton,SelectField,useShowController  } from 'react-admin';
import {CardActions,Button,Paper,Collapse,CircularProgress} from '@material-ui/core';
import {ExpandMore,ExpandLess} from '@material-ui/icons'
import { useAMap } from '../../util/hook';
import {makeStyles} from '@material-ui/styles'
const useStyle = makeStyles({
  mapBox: {
    height: 400,
    position: 'relative',
    zIndex: 1,
    ['@media only screen and (max-width: 500px)']:{
      width: 256,
    },
    ['@media only screen and (max-width: 1024px)']:{
      width: 500,
    },
    ['@media only screen and (min-width: 1440px)']:{
      width: 770,
      height: 600,
    }
  },
})
const OrderShowCompoent:React.FC<any> = (props) => {

  return (
    <Show title="订单详情" {...props} actions={<PostShowActions {...props} />}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField label="订单号" source="uu_id" />
        <TextField label="订单价格" source="price" />
        
        {/* <TextField label="司机联系方式" source="price" />
        <TextField label="司机年龄" source="age" />
        <TextField label="司机驾龄" source="driving_age" /> */}
        <ShowTheCar addLabel label="车辆详情" source="trip.car" {...props}/>
        <ShowTheRoute addLabel label="路线详情" source="trip.car" {...props}/>
        <DateField label="创建时间" source="created_at" showTime/>
        <DateField label="最后更新时间" source="updated_at" showTime/>
      </SimpleShowLayout>
    </Show>
  )
}
const ShowTheRoute = (props: any) => {
  const [visible,setVisible] = React.useState(false); 
  const classes = useStyle()
  const switchVisible = () => {
    setVisible(!visible)
  }
  const {record} = useShowController(props)
  const [routerMap,setRouterMap] = React.useState<any>(null)
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
      routerMap.setPolicy(record.trip.car.route.policy)
      console.log(record.trip.car.route,"yhy")
      let routeData  = [{}]
      try{
        routeData = JSON.parse(record.trip.car.route.path_json);
      }catch(err){
        return;
      }
      
      let start = false;
      const pathData: any[] = []
      routeData.forEach((item:any,index:number)=>{
        if(item.id == record.start_id) start = true;
        if(start)pathData.push(item)
        if(item.id == record.end_id)start = false;
      })
      routerMap.search(pathData)
    }
  },[AMap,record,routerMap])
  const MapField = (props:any) =>{
    return <div {...props} className={classes.mapBox}>
      {mapLoading && <CircularProgress />}
      {mapEl}
    </div>
  }
  return (
    <>
      {visible?<Button startIcon={<ExpandLess />} onClick={switchVisible} color="primary">收起</Button>:<Button startIcon={<ExpandMore />} onClick={switchVisible} color="primary">展开</Button>}
      <Collapse in={visible}>
        <Paper elevation={3}>
          <SimpleShowLayout {...props}>
            <TextField label="路线名称" source="trip.car.route.name" />
            {/* <MapField addLabel label="创建时间"/> */}
            <div className={classes.mapBox}>
              {mapLoading && <CircularProgress />}
              {mapEl}
            </div>
            <DateField label="创建时间" source="trip.car.route.created_at" />
            <DateField label="最后更新时间" source="trip.car.route.updated_at" />
          </SimpleShowLayout>

        </Paper>
      </Collapse>
      
    </>
  )
}
const ShowTheCar = (props:{source:any,record:any,label:any,addLabel: any}) => {
  const [visible,setVisible] = React.useState(false); 
  const switchVisible = () => {
    setVisible(!visible)
  }
  return (
    <>
      {visible?<Button startIcon={<ExpandLess />} onClick={switchVisible} color="primary">收起</Button>:<Button startIcon={<ExpandMore />} onClick={switchVisible} color="primary">展开</Button>}
      <Collapse in={visible}>
        <Paper elevation={3}>
          <SimpleShowLayout {...props}>
            <TextField label="车辆名称" source="trip.car.name" />
            <ImageField label="车辆照片" source="trip.car.image.image" src="path" title="title" />
            <TextField label="车辆联系方式" source="trip.car.phone" />
            <SelectField label="车辆类型" source="trip.car.type" choices={[
              { id: 0, name: '座位' },
              { id: 1, name: '卧铺' },
            ]} />
            <TextField  label="车辆最大载客数" source="trip.car.capacity" />
          </SimpleShowLayout>

        </Paper>
      </Collapse>
      
    </>
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
export default OrderShowCompoent