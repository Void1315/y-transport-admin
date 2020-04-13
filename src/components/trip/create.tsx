import React from 'react'
//@ts-ignore
import {useDataProvider,Create,SimpleForm,TextInput,SelectInput,ImageField,Toolbar,SaveButton,useNotify} from 'react-admin'
import {KeyboardTimePicker} from '@material-ui/pickers'
import format from 'date-fns/format'
const TripCreatCompoent:React.FC<any>  = (props) => {
  const dataProvider = useDataProvider()
  const notify = useNotify();
  const [startTime,setStartTime] = React.useState(new Date())
  const [endTime,setEndTime] = React.useState(new Date())
  const changeSave = (val:any) => {
    dataProvider.create('trip',{
      data:{
        ...val,
        start_time:format(startTime,'HH:mm'),
        end_time:format(endTime,'HH:mm')
      }
    }).then((res:any)=>{
      notify('创建成功!')
    }).catch((err:any)=>{
      notify('创建错误:'+err,'warning')
    })
  }
  return (
    <Create title={"车次管理"} {...props}>
      <TripForm startTime={startTime} endTime={endTime} setEndTime={setEndTime} setStartTime={setStartTime}  postCreateToolbar={PostCreateToolbar} onSave={changeSave} {...props}/>
    </Create>
  )
}
interface ITripFormProps {
  props:any
  startTime:any;
  setStartTime:any;
  endTime:any;
  setEndTime:any;
  onSave:(...args:any)=>any
  postCreateToolbar:React.FC<any>
}

export const TripForm:React.FC<ITripFormProps> = ({endTime,setEndTime,startTime,setStartTime,postCreateToolbar:PostCreateToolbar,onSave,...props}:ITripFormProps) => {
  const dataProvider = useDataProvider()
  const [cars,setCars] = React.useState([])
  React.useEffect(()=>{
    if(dataProvider){
      dataProvider.all('car').then((res:any)=>{
        setCars(res.data)
      })
    }
  },[dataProvider])
  const validateCreation = (values: any) => {
    const errors:any = {};
    if (!values.name)
      errors.name = ['必须输入车次名称'];
    if (!values.car_id)
      errors.car_id = ['必须选择车次关联车辆'];
    if (values.type == undefined)
      errors.type = ['必须选择车次状态'];
    return errors
  };
  return (
    <SimpleForm redirect="show" validate={validateCreation} toolbar={<PostCreateToolbar postCreateToolbar={PostCreateToolbar} onSave={onSave} />} submitOnEnter={false} {...props}>
      <TextInput label="车次名称" source="name" />
      <SelectInput defaultValue={0} label="车次状态" source="type" choices={[
        { id: 0, name: '未启用' },
        { id: 1, name: '已启用' },
      ]}/>
      <SelectInput label="车次名称" source="car_id" choices={cars}/>
      <KeyboardTimePicker 
        value={startTime} 
        ampm={false}
        inputVariant="outlined"
        label="选择开始出票时间"
        invalidDateMessage={"时间格式错误!"}
        maxDateMessage={"超过最大时间"}
        minDateMessage={"小于最小时间"}
        onChange={setStartTime}/>
      <KeyboardTimePicker 
        style={{marginTop:25}}
        value={endTime} 
        ampm={false}
        inputVariant="outlined"
        label="选择结束出票时间"
        invalidDateMessage={"时间格式错误!"}
        maxDateMessage={"超过最大时间"}
        minDateMessage={"小于最小时间"}
        onChange={setEndTime}/>
    </SimpleForm>
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

export default TripCreatCompoent;