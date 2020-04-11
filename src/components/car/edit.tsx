import React from 'react'
//@ts-ignore
import { Edit ,ImageField,SimpleForm,TextInput,ImageInput,useDataProvider,useNotify,Toolbar,SaveButton,useEditController} from 'react-admin';
import {CarForm} from './create'
const CarEditCompoent:React.FC<any> = (props) => {
  return (
    <Edit {...props}>
      <CarForm {...props}/>
    </Edit>
  )
}
export default CarEditCompoent;