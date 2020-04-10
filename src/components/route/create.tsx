import React from 'react'
//@ts-ignore
import { Create, SimpleForm, TextInput,Toolbar,SaveButton,DeleteButton,useDataProvider } from 'react-admin';
import {Map} from 'react-amap'
import { makeStyles } from '@material-ui/core/styles';
import {Add,Delete,Search} from '@material-ui/icons';
import {TextField as MTextField, IconButton, Button,Select,MenuItem, CircularProgress} from '@material-ui/core'
import style from './styles'
import Autocomplete,{createFilterOptions} from '@material-ui/lab/Autocomplete';
// import { useSnackbar } from 'notistack';
//@ts-ignore
import debounce from 'lodash/debounce';
const useStyle = makeStyles((theme: any) => style)
const CreateCompoent:React.FC<any> = (props: any) => {
  const classes = useStyle();
  const dataProvider = useDataProvider()
  const [pathJsonObject,setPathJsonObject] = React.useState<any>([
    { id:-1,keyword: '北京市地震局（公交站）',city:'北京' },
    { id:-2,keyword: '亦庄文化园（地铁站）',city:'北京' }
  ])
  const [AMap,setAMap] = React.useState<any>(null) // AMap对象
  const [map,setMap] = React.useState<any>(null) // 地图本身对象
  const [routeMap,setRouteMap] = React.useState<any>(null)
  const [policy,setPolicy] = React.useState(2);
  const [mapLoadin,setMapLoading] = React.useState(true)
  const [idLen,setIdLen] = React.useState(2)
  const [startAutoComplete,setStartAutoComplete] = React.useState<any>(null);
  React.useEffect(()=>{
    routeMap&&policy&&routeMap.setPolicy(policy)
  },[policy])
  React.useEffect(()=>{
    if(pathJsonObject.length&&routeMap){
      routeMap.search([...pathJsonObject])
    }
  },[routeMap,pathJsonObject])
  React.useEffect(()=>{
    if(map && AMap){
      setupDragRoute(map,AMap)
      setMapLoading(false)
      AMap.plugin('AMap.Autocomplete',()=>{
        let autoOptions = {
          city: '全国',
        }
        setStartAutoComplete(new AMap.Autocomplete(autoOptions))
      })
    }
  },[map,AMap])
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
  const events = {
    created: (map: any) => {
      //@ts-ignore
      setAMap(window.AMap)
      setMap(map)
    },
    click: () => {console.log('You Clicked The Map')}
  }

  const addPathInput = (index:number) => {
    setPathJsonObject([...pathJsonObject.slice(0,index+1),{id:idLen+1,keyword:'',city:''},...pathJsonObject.slice(index+1)])
    setIdLen(idLen+1)
  }
  const deletePathInput = (index:number) => {
    setPathJsonObject([...pathJsonObject.slice(0,index),...pathJsonObject.slice(index+1)])
  }
  const onSelectOption = (e:any,val:any,index:number) => {
    val&&setPathJsonObject([...pathJsonObject.slice(0,index),{
      id: pathJsonObject[index].id,
      keyword: val.name,
      city:val.city
    },...pathJsonObject.slice(index+1)])
  }
  const validateCreation = (values: { name: string; }) => {
    const errors:any = {};
    if (!values.name) {
      errors.name = ['必须输入路线名称'];
    }
    return errors
  };
  const changeSave = (val:any) => {
    // console.log({...val,path_json:pathJsonObject})
    dataProvider.create('routes_data',{
      data:{
        ...val,
        path_json:JSON.stringify(pathJsonObject),
        type:policy
      }
    }).then((res:any)=>{
      console.log(res)
    })
  }
  return (
    <Create title={"asd"} {...props}>
      <SimpleForm validate={validateCreation} toolbar={<PostCreateToolbar onSave={changeSave} />} redirect="show" submitOnEnter={false}>
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
          pathJsonObject&&pathJsonObject.map((item: { id: number; keyword: string; city: string; },index: number)=>{
            return <AutocompleteInput 
              textLabel={(function(){
                if(index === 0)
                  return '选择起点'
                if(index === pathJsonObject.length-1)
                  return '选择终点'
                return '选择经过路径点'
              })()}
              addVisible deleteVisible={index > 1} 
              onAdd={()=>addPathInput(index)} onSelectOption={(e:any,val:any)=>onSelectOption(e,val,index)} onDelete={() => deletePathInput(index)} autoComplete={startAutoComplete} 
              key={item.id} id={item.id} defaultPath={item} />
          })
        }
        <Button
          style={{
            marginBottom:20
          }}
          variant="contained"
          color="secondary" 
          onClick={()=>{
            let _pathJson = [...pathJsonObject]
            routeMap&&routeMap.search(_pathJson)
          }}
          startIcon={< Search />}>
          查询路径
        </Button>
        <div className={classes.mapBox}>
          {mapLoadin && <CircularProgress />}
          <Map  amapkey={"722458940738295f8c529ecd3037af98"}  version={"1.4.15"} events={events} />
        </div>
        <TextInput
          label="路线说明" 
          source="comment"
          multiline
          rows="4"
          variant="outlined"
        />
      </SimpleForm>
    </Create>
  )
}
interface IAutocompleteInputProps {
  onInputChange?:(...args:any)=>any
  onSelectOption?:(...args:any)=>any
  id:number
  defaultPath:{id:number,keyword:string,city:string}
  onAdd:(...args:any)=>any
  onDelete:(...args:any)=>any
  addVisible?:boolean
  deleteVisible?:boolean
  autoComplete:any
  textLabel?: string
}
const AutocompleteInput:React.FC<IAutocompleteInputProps> = ({textLabel="查询路径点",onSelectOption,autoComplete,onDelete,addVisible = true,deleteVisible = true,onAdd,id,defaultPath,onInputChange}:IAutocompleteInputProps)=>{
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
      }
      setLoading(false)
    })
  },500)
  return (
    <div className={classes.autoCompleteAddBox}>
      <Autocomplete
        freeSolo
        defaultValue={{
          name: defaultPath.keyword
        }}
        className={classes.autoComplete}
        filterOptions={filterStartOptions}
        id={`auto-${id}`}
        options={options}
        onChange={(e: any,val: any)=>{
          onSelectOption && onSelectOption(e,val)
        }}
        getOptionLabel={(option:any) => `${option.name}`}
        loading={loading}
        renderInput={(params) => <MTextField value={value} {...params}  size="small" onChange={(e)=>{
          setValue(e.target.value)
          debounceChange(e)
          onInputChange&&onInputChange(e)
        }} label={textLabel} variant="outlined" />}
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