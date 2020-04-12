import React from 'react'
//@ts-ignore
import { Edit } from 'react-admin';
import {CarForm} from './create'
const CarEditCompoent:React.FC<any> = (props) => {
  return (
    <Edit {...props}>
      <CarForm {...props} type="edit"/>
    </Edit>
  )
}
export default CarEditCompoent;