import React from 'react'
//@ts-ignore
import { Edit ,ImageField,SimpleForm,TextInput,ImageInput,useDataProvider,useNotify,Toolbar,SaveButton,useEditController} from 'react-admin';
import {convertFileToBase64} from '../../util/utils'
const DriverEditCompoent:React.FC<any> = (props) => {
  const dataProvider = useDataProvider()
  const notify = useNotify();
  const {
    record, // record fetched via dataProvider.getOne() based on the id from the location
  } = useEditController(props);
  const validateCreation = (values: any) => {
    const errors:any = {};
    if (!values.name) {
      errors.name = ['必须输入司机名称'];
    }
    if(!values.phone)
      errors.phone = ['必须输入司机联系方式'];
    if(!values.age)
      errors.age = ['必须输入司机年龄']
    if(!values.driving_age)
      errors.driving_age = ['必须输入司机驾龄']
    if(!values.image)
      errors.image = ['必须上传司机照片']
    return errors
  };
  const changeSave = (val:any,redirect:any) => {
    if(val && val.image && val.image.rawFile){
      convertFileToBase64(val.image).then((res:any)=>{
      
        dataProvider.update('driver',{
          id:record.id,
          data:{
            ...val,
            age: parseInt(val.age),
            driving_age:parseInt(val.driving_age),
            image:{
              base64: res,
              name: val.image.title,
              type:/\.(\w+)$/.exec(val.image.title)![1]
            }
          }
        }).then((res:any)=>{
          notify('修改成功！')
        }).catch((err:any)=>{
          notify('修改失败:'+err,'warning')
        })
      })
    }else{
      delete val.image
      dataProvider.update('driver',{
        id:record.id,
        data:{
          ...val,
          age: parseInt(val.age),
          driving_age:parseInt(val.driving_age),
        }
      }).then((res:any)=>{
        notify('修改成功！')
      }).catch((err:any)=>{
        notify('修改失败:'+err,'warning')
      })
    }

  }
  return (
    <Edit title={"编辑司机信息"} {...props}>
      <SimpleForm redirect="show" validate={validateCreation} toolbar={<PostCreateToolbar onSave={changeSave} />} submitOnEnter={false}>
        <TextInput label="司机名称" source="name" />
        <TextInput label="司机联系方式" source="phone" />
        <TextInput type="number" label="司机年龄" source="age" />
        <TextInput type="number" label="司机驾龄" source="driving_age" />
        <ImageField label="司机照片" source="image" title="司机照片" />
        <ImageInput source="image" maxSize={20000000} placeholder={<p>拖拽照片到此处</p>} label="修改司机照片" accept="image/*">
          <ImageField source="src" title="title" />
        </ImageInput>
        
      </SimpleForm>
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
  </Toolbar>
);
export default DriverEditCompoent