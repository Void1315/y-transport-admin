import React from 'react'
//@ts-ignore
import {useDataProvider,Create,SimpleForm,TextInput,ImageInput,ImageField,Toolbar,SaveButton,useNotify} from 'react-admin'
import {convertFileToBase64} from '../../util/utils'
const DriverCreactCompoent:React.FC<any> = (props) => {
  const dataProvider = useDataProvider()
  const notify = useNotify();
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
    val&&val.image&&convertFileToBase64(val.image).then((res:any)=>{
      console.log(res)
      dataProvider.create('driver',{
        data:{
          ...val,
          age: parseInt(val.age),
          driving_age:parseInt(val.driving_age),
          image:{
            base64: res.base64,
            name: val.image.title,
            type:/\.(\w+)$/.exec(val.image.title)![1]
          }
        }
      }).then((res:any)=>{
        notify('创建成功！')
      }).catch((err:any)=>{
        notify('创建失败:'+err,'warning')
      })
    })
  }
  return (
    <Create title={"司机管理"} {...props}>
      <SimpleForm redirect="show" validate={validateCreation} toolbar={<PostCreateToolbar onSave={changeSave} />} submitOnEnter={false}>
        <TextInput label="司机名称" source="name" />
        <TextInput label="司机联系方式" source="phone" />
        <TextInput type="number" label="司机年龄" source="age" />
        <TextInput type="number" label="司机驾龄" source="driving_age" />
        <ImageInput source="image" maxSize={20000000} placeholder={<p>拖拽照片到此处</p>} label="上传司机照片" accept="image/*">
          <ImageField source="src" title="title" />
        </ImageInput>

      </SimpleForm>
    </Create>
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
export default DriverCreactCompoent;