import React, { useEffect } from 'react'
//@ts-ignore
import { Create, SimpleForm, TextInput,Toolbar,SaveButton,useNotify,useDataProvider,SelectInput,ImageInput,ImageField } from 'react-admin';
import {convertFileToBase64} from '../../util/utils'
const CarCreateCompoent:React.FC<any> = (props) => {
  return (
    <Create title={"车辆管理"} {...props}>
      <CarForm {...props} type="create"/>
    </Create>
  )
}
interface ICarFormProps {
  type:string
  record:any
}
export const CarForm:React.FC<ICarFormProps> = (props:ICarFormProps) => {
  const dataProvider = useDataProvider()
  const notify = useNotify();
  const [routes,setRoutes] = React.useState<Array<any>>([{}])
  useEffect(()=>{
    dataProvider&&dataProvider.all('routes_data').then((res:any)=>{
      setRoutes(res.data)
    })
  },[dataProvider])
  const changeSave = (val:any,redirect:any) => {
    if(val.image){
      Promise.all(val.image.map((item:any)=>convertFileToBase64(item))).then(res=>{
        const images = res.map((item:any)=>{
          return {
            base64: item.base64,
            name: item.title,
            type: /\.(\w+)$/.exec(item.title)![1]
          }
        })
        dataProvider.create('car',{
          data:{
            ...val,
            image:images,
            capacity:parseInt(val.capacity,10)
          }
        }).then((res:any)=>{
          notify('创建成功！')
        }).catch((err:any)=>{
          notify('创建失败:'+err,'warning')
        })
      })
    }else{
      dataProvider.create('car',{
        data:{
          ...val,
          capacity:parseInt(val.capacity,10)
        }
      }).then((res:any)=>{
        notify('创建成功！')
      }).catch((err:any)=>{
        notify('创建失败:'+err,'warning')
      })
    }
  }
  const changeEdit  = (val:any,redirect:any) => {
    Promise.all(val.image.image.map((item:any)=>convertFileToBase64(item))).then((res:any)=>{
      const images = res.map((item:any)=>{
        return item.path?{...item}:{
          base64: item.base64,
          name: item.title,
          type: /\.(\w+)$/.exec(item.title)![1]
        }
      })
      dataProvider.update('car',{
        id:props.record.id,
        data:{
          ...val,
          image:images,
          capacity:parseInt(val.capacity,10)
        }
      }).then((res:any)=>{
        notify('修改成功！')
      }).catch((err:any)=>{
        notify('修改失败:'+err,'warning')
      })
    })
  }
  const onSave = (val:any,redirect:any) => {
    if(props.type === "create"){
      return changeSave(val,redirect)
    }else{
      return changeEdit(val,redirect)
    }
  }
  const validateCreation = (values: any) => {
    const errors:any = {};
    if (!values.name) {
      errors.name = ['必须输入车辆名称'];
    }
    if(!values.phone)
      errors.phone = ['必须输入车辆联系方式'];
    if(!values.number)
      errors.number = ['必须输入车牌号']
    if(!values.type)
      errors.type = ['必须选择车辆类型']
    if(!values.capacity)
      errors.capacity = ['必须选择车辆最大载客数']
    if(!values.image)
      errors.image = ['必须上传车辆图片']
    if(!values.route_id)
      errors.route_id = ['必须选择车辆路线']
    return errors
  };
  const MyImageField:React.FC<any> = (props) => {
    return (
      <ImageField {...props} />
    )
  }
  return (
    <SimpleForm {...props} redirect="show" validate={validateCreation}  toolbar={<PostCreateToolbar type={props.type} onSave={onSave} />} submitOnEnter={false}>
      <TextInput label="车辆名称" source="name" />
      <TextInput label="车牌号" source="number" />
      <TextInput  label="车辆联系电话" source="phone" />
      <SelectInput label="车辆类型" source="type" choices={[
        { id: 0, name: '座位' },
        { id: 1, name: '卧铺' },
      ]} />
      <TextInput type="number" label="车辆最大载客数" source="capacity" />
      <SelectInput label="车辆路线" source="route_id" choices={routes} />
      {
        props.type === "create"?<ImageInput source="image" multiple placeholder={<p>拖拽图片到此处</p>} label="上传车辆图片,可选择多张图片" accept="image/*">
          <MyImageField label="车辆图片" source="path" title="title" /></ImageInput>:(<ImageInput source="image.image" multiple placeholder={<p>拖拽图片到此处</p>} label="上传车辆图片,可选择多张图片" accept="image/*">
          <MyImageField label="车辆图片" source="path" title="title" />
        </ImageInput>)
      }
      
    </SimpleForm>
  )
}
interface IPostCreateToolbarProps extends JSX.IntrinsicAttributes{
    onSave?:(...args:any)=>any
    type: string
}
const PostCreateToolbar:React.FC<IPostCreateToolbarProps> = ({onSave,...props}:IPostCreateToolbarProps) => (
  <Toolbar {...props} >
    <SaveButton
      onSave={(val:any,redirect:any)=>{
        onSave && onSave(val,redirect)
      }}
      label={props.type==="create"?"创建":"修改"}
      redirect="show"
      submitOnEnter={false}
    />
  </Toolbar>
);
export default CarCreateCompoent