import React from 'react'
//@ts-ignore
import { Create, SimpleForm, TextInput,Toolbar,SaveButton,useNotify,useDataProvider } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import {Add,Delete,Search} from '@material-ui/icons';
import {TextField as MTextField, IconButton, Button,Select,MenuItem, CircularProgress,InputAdornment} from '@material-ui/core'
import style from './styles'
//@ts-ignore
import _ from 'loadsh';
import {useAMap} from '../../util/hook'
import parse from 'date-fns/parse'
import Autocomplete,{createFilterOptions} from '@material-ui/lab/Autocomplete';
import {KeyboardTimePicker} from '@material-ui/pickers'
import format from 'date-fns/format'
//@ts-ignore
import debounce from 'lodash/debounce';
const useStyle = makeStyles((theme: any) => style)
const CreateCompoent:React.FC<any> = (props: any) => {
  
  const notify = useNotify();
  const dataProvider = useDataProvider()
  const [pathJsonObject,setPathJsonObject] = React.useState<any>([
    { id:-1,keyword: '北京市地震局（公交站）',lng: 116.306007,lat: 39.979771,city:'北京',time:format(new Date(),'HH:mm'),district:'' },
    { id:-2,keyword: '亦庄文化园（地铁站）',city:'北京', lng: 116.490632,lat: 39.80689,time:format(new Date(),'HH:mm'),district:'' }
  ])

  const [routeMap,setRouteMap] = React.useState<any>(null)
  const [policy,setPolicy] = React.useState(2);
  React.useEffect(()=>{
    routeMap&&policy&&routeMap.setPolicy(policy)
  },[policy])
  React.useEffect(()=>{
    if(pathJsonObject.length&&routeMap){
      routeMap.search([...pathJsonObject])
    }
  },[routeMap,pathJsonObject])


  const changeSave = (val:any) => {
    dataProvider.create('routes_data',{
      data:{
        ...val,
        path_json:JSON.stringify(pathJsonObject.map((item:any)=>{
          return {
            ...item,
            id: Math.abs(item.id) // 取绝对值
          }
        })),
        type:policy
      }
    }).then((res:any)=>{
      notify('创建成功!')
    }).catch((err:any)=>{
      notify('创建错误:'+err,'warning')
    })
  }
  return (
    <Create title={"路线管理"} {...props}>
      <RouteForm postCreateToolbar={PostCreateToolbar} pathJsonObject={pathJsonObject} setPathJsonObject={setPathJsonObject}  onSave={changeSave} {...props}/>
    </Create>
  )
}
interface IRouteFormProps{
  props:any
  pathJsonObject?:any;
  setPathJsonObject:React.Dispatch<any>
  onSave:(...args:any)=>any
  postCreateToolbar:React.FC<any>
}
export const RouteForm:React.FC<IRouteFormProps> = ({postCreateToolbar:PostCreateToolbar,setPathJsonObject,pathJsonObject=[
  { id:-1,keyword: '北京市地震局（公交站）',lng: 116.306007,lat: 39.979771,city:'北京',time:format(new Date(),'HH:mm'),district:'北京' },
  { id:-2,keyword: '亦庄文化园（地铁站）',city:'北京', lng: 116.490632,lat: 39.80689,time:format(new Date(),'HH:mm'),district:'北京' }
],onSave,...props}:IRouteFormProps) => {
  const [policy,setPolicy] = React.useState(2);
  const [idLen,setIdLen] = React.useState(2)
  const [routeMap,setRouteMap] = React.useState<any>(null)
  const [startAutoComplete,setStartAutoComplete] = React.useState<any>(null);
  const classes = useStyle();
  /**
   * 加载路径
   * @param map 
   * @param AMap 
   */
  const setupDragRoute = (map: any,AMap:any) => {
    AMap.plugin(["AMap.Driving"],()=>{
      let r = new AMap.Driving({
        policy,
        map,
      })
      setRouteMap(r)
    });
  }
  const search = () => {
    if(AMap&&routeMap){
      let _pathJson = _.cloneDeep(pathJsonObject)
      const startPoint =  new AMap.LngLat(_pathJson[0].lng,_pathJson[0].lat) 
      const endPoint = new AMap.LngLat(_pathJson[_pathJson.length - 1].lng,_pathJson[_pathJson.length - 1].lat) 
      const opts = {waypoints:_pathJson.slice(1,-1).map((item: { lng: any; lat: any; })=>{
        return new AMap.LngLat(item.lng,item.lat)
      })}
      routeMap&&routeMap.search(startPoint,endPoint,opts)
    }
  }
  const created = (map: any) => {}
  const {loading,
    el,
    map,
    AMap} = useAMap({created:created})

  const validateCreation = (values: { name: string; }) => {
    const errors:any = {};
    if (!values.name) {
      errors.name = ['必须输入路线名称'];
    }
    return errors
  };
  const onChangePrice = (value:any,index:number) => {
    pathJsonObject[index].price = parseFloat(value)
    setPathJsonObject(pathJsonObject)
  }
  const addPathInput = (index:number) => {
    setPathJsonObject([...pathJsonObject.slice(0,index+1),{id:idLen+1,district:'',lng:0, lat:0,keyword:'',city:'',time:pathJsonObject[index].time},...pathJsonObject.slice(index+1)])
    setIdLen(idLen+1)
  }
  const deletePathInput = (index:number) => {
    setPathJsonObject([...pathJsonObject.slice(0,index),...pathJsonObject.slice(index+1)])
  }
  const onSelectOption = (e:any,val:any,index:number) => {
    val&&setPathJsonObject([...pathJsonObject.slice(0,index),{
      id: Math.abs(pathJsonObject[index].id),
      keyword: val.name,
      city:val.city,
      district:val.district,
      lng:val.location.lng,
      lat:val.location.lat,
      time:pathJsonObject[index].time
    },...pathJsonObject.slice(index+1)])
  }
  React.useEffect(()=>{
    if(map && AMap){
      setupDragRoute(map,AMap)
      AMap.plugin('AMap.Autocomplete',()=>{
        let autoOptions = {
          city: '全国',
        }
        setStartAutoComplete(new AMap.Autocomplete(autoOptions))
      })
    }
  },[map,AMap])
  React.useEffect(()=>{
    search()
  },[routeMap,pathJsonObject])
  return (
    <SimpleForm validate={validateCreation} toolbar={<PostCreateToolbar onSave={onSave} />} redirect="show" submitOnEnter={false} {...props}>
      <TextInput label="路线名称" source="name" />
      <div style={{
        marginBottom:20
      }}>
        {<Select
          placeholder="选择行驶策略"
          labelId="选择行驶策略"
          fullWidth
          value={policy}
          onChange={(event:any)=>{
            setPolicy(event.target.value)
          }}
        >
          <MenuItem value={2}>最短距离模式</MenuItem>
          <MenuItem value={0}>最快捷模式</MenuItem>
          <MenuItem value={1}>最经济模式</MenuItem>
          <MenuItem value={4}>考虑实时路况</MenuItem>
        </Select>}
      </div>
      {
        pathJsonObject&&pathJsonObject.map((item: { id: number; lng:number;lat:number;keyword: string;district:string; city: string;price:number,time:string },index: number)=>{
          return <AutocompleteInput 
            defaultPrice={item.price}
            textLabel={(function(){
              if(index === 0)
                return '选择起点'
              if(index === pathJsonObject.length-1)
                return '选择终点'
              return '选择经过路径点'
            })()}
            onChangePrice={(event)=>{
              return onChangePrice(event.target.value,index)
            }}
            setPathJsonObject={setPathJsonObject}
            pathJsonObject={pathJsonObject}
            priceShow={index > 0}
            defaultTime={item.time}
            addVisible deleteVisible={index > 1} 
            onAdd={()=>addPathInput(index)} onSelectOption={(e:any,val:any)=>onSelectOption(e,val,index)} onDelete={() => deletePathInput(index)} autoComplete={startAutoComplete} 
            key={item.id} id={item.id} index={index} defaultPath={item} />
        })
      }
      <Button
        style={{
          marginBottom:20
        }}
        variant="contained"
        color="primary"  
        onClick={()=>{
          search()
        }}
        startIcon={< Search />}>
          查询路径
      </Button>
      <div className={classes.mapBox}>
        {loading && <CircularProgress />}
        {el}
      </div>
      <TextInput
        label="路线说明" 
        source="comment"
        multiline
        rows="4"
        variant="outlined"
      />
    </SimpleForm>
  )
}
interface IAutocompleteInputProps {
  onInputChange?:(...args:any)=>any
  onSelectOption?:(...args:any)=>any
  id:number
  index:number;
  defaultPath:{id:number,keyword:string,city:string,time:string,district:string}
  onAdd:(...args:any)=>any
  onDelete:(...args:any)=>any
  onChangePrice:(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>any
  defaultPrice?:number
  pathJsonObject:any
  setPathJsonObject:React.Dispatch<any>
  priceShow?:boolean
  addVisible?:boolean
  deleteVisible?:boolean
  autoComplete:any
  textLabel?: string
  defaultTime?: string
}
const AutocompleteInput:React.FC<IAutocompleteInputProps> = ({pathJsonObject,index,setPathJsonObject,defaultTime="00:00",onChangePrice,priceShow=true,defaultPrice=0.0,textLabel="查询路径点",onSelectOption,autoComplete,onDelete,addVisible = true,deleteVisible = true,onAdd,id,defaultPath,onInputChange}:IAutocompleteInputProps)=>{
  const classes = useStyle();
  const [value,setValue] = React.useState('')
  const [loading,setLoading] = React.useState(true)
  const [options,setOptions] = React.useState<any>([])
  const [dateTime,setDateTime] = React.useState(()=>parse(defaultTime as string, 'HH:mm', new Date()))
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
      }
      setLoading(false)
    })
  },500)
  return (
    <div className={classes.autoCompleteAddBox}>
      <Autocomplete
        freeSolo
        defaultValue={{
          name: defaultPath.keyword,
          district:defaultPath.district
        }}
        className={classes.autoComplete}
        filterOptions={filterStartOptions}
        id={`auto-${id}`}
        options={options}
        onChange={(e: any,val: any)=>{
          onSelectOption && onSelectOption(e,val)
        }}
        getOptionLabel={(option:any) => `${option.name}-${option.district}`}
        loading={loading}
        renderInput={(params) => <MTextField value={value} {...params}  onChange={(e)=>{
          setValue(e.target.value)
          debounceChange(e)
          onInputChange&&onInputChange(e)
        }} label={textLabel} variant="outlined" />}
      />
      {
        priceShow&&<MTextField label="票价"  variant="outlined" style={{marginLeft:20}} defaultValue={defaultPrice} InputProps={{endAdornment:<InputAdornment position="end">元</InputAdornment>}} onChange={onChangePrice} type="number" placeholder="票价"  />
      }
      <KeyboardTimePicker 
        style={{marginLeft:20}}
        value={dateTime} 
        ampm={false}
        inputVariant="outlined"
        label="选择到站时间"
        invalidDateMessage={"时间格式错误!"}
        maxDateMessage={"超过最大时间"}
        minDateMessage={"小于最小时间"}
        onChange={(date,value)=>{
          pathJsonObject[index].time = value;
          setPathJsonObject(pathJsonObject)
          setDateTime(parse(value as string, 'HH:mm', new Date()))
        }}/>
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
interface IPostCreateToolbarProps extends JSX.IntrinsicAttributes{
  onSave?:(...args:any)=>any
}
const PostCreateToolbar:React.FC<IPostCreateToolbarProps> = ({onSave,...props}:IPostCreateToolbarProps) => (
  <Toolbar {...props} >
    <SaveButton
      onSave={(val:any,redirect:any)=>{
        onSave && onSave(val,redirect)
      }}
      label="创建"
      redirect="show"
      submitOnEnter={false}
    />
  </Toolbar>
);
export default CreateCompoent;