import React from 'react'
//@ts-ignore
import { required, Edit, SimpleForm, TextInput } from 'react-admin';
import {Map} from 'react-amap'
import { makeStyles } from '@material-ui/core/styles';
import {TextField as MTextField, Button} from '@material-ui/core'
import style from './styles'
import Autocomplete,{createFilterOptions} from '@material-ui/lab/Autocomplete';
import { useSnackbar } from 'notistack';
//@ts-ignore
import debounce from 'lodash/debounce';
const useStyle = makeStyles((theme: any) => style)
const EditCompoent = (props: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyle();
  const [startValue,setStartValue] = React.useState('')
  const [startPoint,setStartPoint] = React.useState<any>(null)
  const [endValue,setEndValue] = React.useState('')
  const [endPoint,setEndPoint] = React.useState<any>(null)
  const [AMap,setAMap] = React.useState<any>(null) // AMap对象
  const [map,setMap] = React.useState<any>(null) // 地图本身对象
  const [options,setOptions] = React.useState<any>([]) // 自动补全选项
  const [endLoading,setEndLoading] = React.useState(true)
  const [startLoading,setStartLoading] = React.useState(true)
  const [routeMap,setRouteMap] = React.useState<any>(null)
  // let routeMap:any = null;
  let pathPoint:Array<Array<Number>> = [[]]
  const [endAutoComplete,setEndAutoComplete] = React.useState<any>(null);
  const [startAutoComplete,setStartAutoComplete] = React.useState<any>(null);
  const searchPath = (AMap:any) => {
    if(routeMap&&routeMap.search){
      if(startPoint){
        pathPoint[0][0] = startPoint.location.R
        pathPoint[0][1] = startPoint.location.Q
      }
      if(endPoint){
        pathPoint[1] = [endPoint.location.R,endPoint.location.Q]
      }
      setupDragRoute(map,AMap,pathPoint)

    }
  }
  React.useEffect(()=>{
    AMap&&searchPath(AMap)
  },[startPoint,endPoint])
  React.useEffect(()=>{
    if(map && AMap){
      setupDragRoute(map,AMap)
      AMap.plugin('AMap.Autocomplete',()=>{
        let autoOptions = {
          city: '全国',
        }
        setStartAutoComplete(new AMap.Autocomplete(autoOptions))
      })
      AMap.plugin('AMap.Autocomplete', ()=>{
        let autoOptions = {
          city: '全国'
        }
        setEndAutoComplete(new AMap.Autocomplete(autoOptions))
      })
    }
  },[map,AMap])
  /**
   * 加载路径
   * @param map 
   * @param AMap 
   */
  const setupDragRoute = (map: any,AMap:any,pathList:Array<any> = pathPoint) => {
    routeMap&&routeMap.destroy()
    AMap.plugin(["AMap.DragRoute"],()=>{
      let r = new AMap.DragRoute(map, pathList, AMap.DrivingPolicy.LEAST_FEE)
      setRouteMap(r)
      AMap.event.addListener(r,'complete',(type: any,target: any,data: any)=>{
        console.log(type,target,data)
      })
      console.log(pathList)
      r.search()
    });
  }
  const checkLocation = (location:any):boolean=>{
    console.log(location)
    if(!location||!Object.keys(location).includes("lng")){
      enqueueSnackbar('请选择详细地址!', { variant:'warning' })
      return false
    }
    return true
  }
  const events = {
    created: (map: any) => {
      //@ts-ignore
      setAMap(window.AMap)
      setMap(map)
    },
    click: () => {console.log('You Clicked The Map')}
  }

  const debounceStartChange = (e:any) => {
    e.persist()
    setStartLoading(true)
    changeStart(e)
  }
  const debounceEndChange = (e:any) => {
    e.persist()
    setEndLoading(true)
    changeEnd(e)
  }
  const changeStart = debounce((e: any) => {
    setStartValue(e.target.value)
    startAutoComplete.search(e.target.value,(status: string, result: any)=> {
      // 搜索成功时，result即是对应的匹配数据
      if(status === "complete"){
        setOptions(result.tips)
      }else{
        console.log("error!")
      }
      setEndLoading(false)
    })
  },500)
  const changeEnd = debounce((e:any) => {
    setEndValue(e.target.value)
    endAutoComplete.search(e.target.value,(status: string, result: any)=> {
      // 搜索成功时，result即是对应的匹配数据
      if(status === "complete"){
        setOptions(result.tips)
      }else{
        console.log("error!")
      }
      setEndLoading(false)
    })
  },500)
  const filterEndOptions = createFilterOptions({
    stringify: (option:any) => endValue,
  })
  const filterStartOptions = createFilterOptions({
    stringify: (option:any) => startValue,
  });
  return (
    <Edit title={"asd"} {...props}>
      <SimpleForm submitOnEnter={false}>
        <TextInput label="Id" disabled source="id" />
        <TextInput source="path_json" validate={required()} />
        <Button onClick={()=>{
          routeMap&&routeMap.destroy()
        }}>销毁</Button>
        <Autocomplete
          className={classes.autoComplete}
          filterOptions={filterStartOptions}
          id="start-auto"
          options={options}
          onChange={(e: any,val: any)=>{
            val && checkLocation(val.location) && setStartPoint(val)
            searchPath(AMap)
            
          }}
          getOptionLabel={(option:any) => `${option.district}-${option.name}`}
          loading={startLoading}
          renderInput={(params) => <MTextField {...params} value={startValue} onChange={debounceStartChange} label='查询起点' variant="outlined" />}
        />
        <Autocomplete
          className={classes.autoComplete}
          filterOptions={filterEndOptions}
          id="end-auto"
          options={options}
          onChange={(e: any,val: any)=>{
            val && checkLocation(val.location) && setEndPoint(val)
            searchPath(AMap)
            
          }}
          getOptionLabel={(option:any) => `${option.district}-${option.name}`}
          loading={endLoading}
          renderInput={(params) => <MTextField {...params} value={endValue} onChange={debounceEndChange} label='查询终点' variant="outlined" />}
        />
        <div className={classes.mapBox}>
          <Map  amapkey={"722458940738295f8c529ecd3037af98"}  version={"1.4.15"} events={events} />
        </div>
      </SimpleForm>
    </Edit>
  )
}
export default EditCompoent;