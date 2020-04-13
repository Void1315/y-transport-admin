import React from 'react'
//@ts-ignore
import { Edit, SimpleForm, TextInput,Toolbar,SaveButton,DeleteButton,useEditController,useDataProvider } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import {Add,Delete,Search} from '@material-ui/icons';
import {TextField as MTextField, OutlinedInput,IconButton, Button,Select,MenuItem, CircularProgress, InputAdornment} from '@material-ui/core'
import style from './styles'
import {RouteForm} from './create'
import Autocomplete,{createFilterOptions} from '@material-ui/lab/Autocomplete';
// import { useSnackbar } from 'notistack';
//@ts-ignore
import debounce from 'lodash/debounce';
const useStyle = makeStyles((theme: any) => style)
const EditCompoent:React.FC<any> = (props: any) => {
  const dataProvider = useDataProvider()
  const [pathJsonObject,setPathJsonObject] = React.useState<any>([
    { id:-1,keyword: '北京市地震局（公交站）',city:'北京',price:0 },
    { id:-2,keyword: '亦庄文化园（地铁站）',city:'北京',price:0 }
  ])
  const [routeMap,setRouteMap] = React.useState<any>(null)
  const [policy,setPolicy] = React.useState(2); // 策略
  const [idLen,setIdLen] = React.useState(2)
  const {
    record, // record fetched via dataProvider.getOne() based on the id from the location
  } = useEditController(props);
  React.useEffect(()=>{
    if(record){
      setPolicy(record.type)
      let _pathJson = JSON.parse(record.path_json)
      setPathJsonObject(JSON.parse(record.path_json)) // 使用后台pathJson
      console.log(JSON.parse(record.path_json))
      let max = idLen;
      for(let j = 0,len=_pathJson.length; j < len; j++) {
        max = max > _pathJson[j].id?max:_pathJson[j].id;
      }
      setIdLen(max)
    }
  },[record])

  const changeSave = (val:any) => {
    dataProvider.update('routes_data',{
      id:record.id,
      data:{
        ...val,
        path_json:pathJsonObject
      }
    }).then((res:any)=>{
      console.log(res)
    })
  }
  return (
    <Edit title={"编辑路线"} {...props}>
      <RouteForm pathJsonObject={pathJsonObject} postCreateToolbar={PostCreateToolbar} setPathJsonObject={setPathJsonObject} onSave={changeSave} {...props} />
    </Edit>
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
      label="保存"
      redirect="show"
      submitOnEnter={false}
    />
    <DeleteButton 
      label="删除"
    />
  </Toolbar>
);
export default EditCompoent;