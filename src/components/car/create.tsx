import React from 'react'
//@ts-ignore
import { Create, SimpleForm, TextInput,Toolbar,SaveButton,useNotify,useDataProvider,SelectInput,ImageInput,ImageField } from 'react-admin';
import {convertFileToBase64} from '../../util/utils'
const CarCreateCompoent:React.FC<any> = (props) => {
  return (
    <Create title={"车辆管理"} {...props}>
      <CarForm {...props} />
    </Create>
  )
}
export const CarForm:React.FC<any> = (prpps) => {
  const dataProvider = useDataProvider()
  const notify = useNotify();
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
      errors.number = ['必须选择车辆类型']
    if(!values.capacity)
      errors.capacity = ['必须选择车辆最大载客数']
    return errors
  };
  return ( //validate={validateCreation}
    <SimpleForm {...prpps} redirect="show"  toolbar={<PostCreateToolbar onSave={changeSave} />} submitOnEnter={false}>
      <TextInput label="车辆名称" source="name" />
      <TextInput label="车牌号" source="number" />
      <TextInput  label="车辆联系电话" source="phone" />
      <SelectInput label="车辆类型" source="type" choices={[
        { id: 0, name: '座位' },
        { id: 1, name: '卧铺' },
      ]} />
      <TextInput type="number" label="车辆最大载客数" source="capacity" />
      <ImageInput source="image" multiple placeholder={<p>拖拽图片到此处</p>} label="上传车辆图片" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>
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
export default CarCreateCompoent