import React from 'react'
import {TripForm} from './create'
//@ts-ignore
import { Edit,Toolbar,SaveButton,DeleteButton, useNotify,useEditController,useDataProvider } from 'react-admin';
import parse from 'date-fns/parse'
import format from 'date-fns/format'
const TripEditCompoent:React.FC<any> = (props) => {
  const dataProvider = useDataProvider()
  const notify = useNotify();
  const [startTime,setStartTime] = React.useState(new Date())
  const [endTime,setEndTime] = React.useState(new Date())
  const {record} = useEditController(props);
  const changeEdit = (val:any) => {
    dataProvider.update('trip',{
      id:record.id,
      data:{
        ...val,
        start_time: format(startTime,'HH:mm'),
        end_time:format(endTime,'HH:mm')
      }
    }).then((res:any)=>{
      notify('修改成功!')
    }).catch((error:any)=>{
      notify('修改失败:'+error,'warning')
    })
  }
  React.useEffect(()=>{
    if(record){
      setEndTime(parse(record.end_time,"HH:mm:ss",new Date()))
      setStartTime(parse(record.start_time,'HH:mm:ss',new Date()))
    }
  },[record])
  return <Edit title={"编辑路线"} {...props}>
    <TripForm onSave={changeEdit} startTime={startTime} setStartTime={setStartTime} postCreateToolbar={PostCreateToolbar} endTime={endTime} setEndTime={setEndTime} {...props}/>
  </Edit>
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
export default TripEditCompoent;