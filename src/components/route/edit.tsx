import React from 'react'
//@ts-ignore
import { required, Edit, SimpleForm, TextInput } from 'react-admin';
import {Map} from 'react-amap'
import { makeStyles } from '@material-ui/core/styles';
import {Add,Delete,Search} from '@material-ui/icons';
import {TextField as MTextField, IconButton, Button} from '@material-ui/core'
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

  const [pathJson,setPathJson] = React.useState([
    { id:0,keyword: '北京市地震局（公交站）',city:'北京' },
    { id:1,keyword: '亦庄文化园（地铁站）',city:'北京' },
    // { id:2,keyword: '2亦庄文化园（地铁站）',city:'北京' },
    // { id:3,keyword: '3亦庄文化园（地铁站）',city:'北京' },
    // { id:4,keyword: '4亦庄文化园（地铁站）',city:'北京' },
  ])
  const searchPath = (AMap:any) => {
    if(routeMap&&routeMap.search){
      if(startPoint){
        pathPoint[0][0] = startPoint.location.R
        pathPoint[0][1] = startPoint.location.Q
      }
      if(endPoint){
        pathPoint[1] = [endPoint.location.R,endPoint.location.Q]
      }
      // setupDragRoute(map,AMap,pathPoint)

    }
  }
  React.useEffect(()=>{
    AMap&&searchPath(AMap)
  },[startPoint,endPoint])
  React.useEffect(()=>{
    if(map && AMap){
      console.log('set Map')
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
    // routeMap&&routeMap.destroy()
    AMap.plugin(["AMap.Driving"],()=>{
      let r = new AMap.Driving({
        policy: AMap.DrivingPolicy.LEAST_TIME,
        map,
      })
      setRouteMap(r)
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


  const debounceEndChange = (e:any) => {
    e.persist()
    setEndLoading(true)
    changeEnd(e)
  }
  const debounceStartChange = (e:any) => {
    e.persist()
    setStartLoading(true)
    changeStart(e)
  }
  const changeStart = debounce((e: any) => {
    // setStartValue(e.target.value)
    startAutoComplete.search(e.target.value,(status: string, result: any)=> {
      // 搜索成功时，result即是对应的匹配数据
      if(status === "complete"){
        setOptions(result.tips)
      }else{
        console.log("error!")
      }
      setStartLoading(false)
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
  const addPathInput = (index:number) => {
    setPathJson([...pathJson.slice(0,index+1),{id:pathJson[pathJson.length - 1].id+1,keyword:'',city:''},...pathJson.slice(index+1)])
  }
  const deletePathInput = (index:number) => {
    setPathJson([...pathJson.slice(0,index),...pathJson.slice(index+1)])
  }
  const onSelectOption = (e:any,val:any) => {
    console.log(e,val)
  }
  return (
    <Edit title={"asd"} {...props}>
      <SimpleForm submitOnEnter={false}>
        <TextInput label="Id" disabled source="id" />
        <TextInput source="path_json" validate={required()} />
        {
          pathJson.map((item,index)=>{
            return <AutocompleteInput addVisible deleteVisible={index > 1} 
              onAdd={()=>addPathInput(index)} onSelectOption={onSelectOption} onDelete={() => deletePathInput(index)} autoComplete={startAutoComplete} 
              // onInputChange={debounceStartChange} 
              key={item.id} id={index} defaultPath={item} />
          })
        }
        <Button
          style={{
            marginBottom:20
          }}
          variant="contained"
          color="secondary" 
          onClick={()=>{
            let _pathJson = [...pathJson]
            console.log([_pathJson[0],_pathJson[1]])
            routeMap&&routeMap.search(_pathJson)
          }}
          startIcon={< Search />}>
          查询路径
        </Button>
        {/* <Autocomplete

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
          renderInput={(params) => <MTextField {...params} size="small" value={endValue} onChange={debounceEndChange} label='查询终点' variant="outlined" />}
        /> */}
        <div className={classes.mapBox}>
          <Map  amapkey={"722458940738295f8c529ecd3037af98"}  version={"1.4.15"} events={events} />
        </div>
      </SimpleForm>
    </Edit>
  )
}
interface IAutocompleteInputProps {
  onInputChange?:(...args:any)=>any
  onSelectOption?:(...args:any)=>any
  id:number
  defaultPath:{keyword:string,city:string}
  onAdd:(...args:any)=>any
  onDelete:(...args:any)=>any
  addVisible?:boolean
  deleteVisible?:boolean
  autoComplete:any
}
const AutocompleteInput:React.FC<IAutocompleteInputProps> = ({onSelectOption,autoComplete,onDelete,addVisible = true,deleteVisible = true,onAdd,id,defaultPath,onInputChange}:IAutocompleteInputProps)=>{
  const classes = useStyle();
  const [value,setValue] = React.useState('')
  const [loading,setLoading] = React.useState(true)
  const [options,setOptions] = React.useState<any>([])
  const filterStartOptions = createFilterOptions({
    stringify: (option:any) => value,
  });
  const debounceChange = (e:any) => {
    e.persist()
    setLoading(true)
    changeStart(e)
  }
  const changeStart = debounce((e: any) => {
    setValue(e.target.value)
    autoComplete.search(e.target.value,(status: string, result: any)=> {
      // 搜索成功时，result即是对应的匹配数据
      if(status === "complete"){
        setOptions(result.tips)
      }else{
        console.log("error!")
      }
      setLoading(false)
    })
  },500)
  return (
    <div className={classes.autoCompleteAddBox}>
      <Autocomplete
        freeSolo
        defaultValue={{
          district:defaultPath.city,
          name: defaultPath.keyword
        }}
        className={classes.autoComplete}
        filterOptions={filterStartOptions}
        id={`auto-${id}`}
        options={options}
        onChange={(e: any,val: any)=>{
          console.log('change',e.target)
          onSelectOption && onSelectOption(e,val)
          // val && checkLocation(val.location) && setStartPoint(val)
          // searchPath(AMap)
        }}
        getOptionLabel={(option:any) => `${option.district}-${option.name}`}
        loading={loading}
        renderInput={(params) => <MTextField value={value} {...params}  size="small" onChange={(e)=>{
          setValue(e.target.value)
          debounceChange(e)
          onInputChange&&onInputChange(e)
        }} label='查询路径点' variant="outlined" />}
      />
      {
        addVisible &&<IconButton onClick={onAdd}>
          <Add />
        </IconButton>
      }
      {
        deleteVisible && <IconButton onClick={onDelete}>
          <Delete color="error" />
        </IconButton>
      }
      
    </div>
  )
}
export default EditCompoent;