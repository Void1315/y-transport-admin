import React from 'react'
//@ts-ignore
import { List, Datagrid, TextField,SelectField,DateField } from "react-admin";
import {OptionButtonGroup} from '../options'
const OrderListCompoent:React.FC<any>  = (props) => {
  return (
    <List title="订单" {...props}>
      <Datagrid>
        <TextField source="id" label="序号" />
        <TextField source="uu_id" label="订单号" />
        <TextField source="price" label="订单价格" />
        <SelectField label="订单状态" source="status" choices={[
          {id:-1,name:"异常"},
          {id:0,name:"未支付"},
          {id:1,name:"已支付"},
          {id:2,name:"已完成"},
          {id:3,name:"未完成"},
        ]} />
        <DateField source="created_at" label="创建日期" />
        <DateField source="updated_at" label="修改日期" />
        <OptionButtonGroup source="order" name="订单" label="操作" />
      </Datagrid>
    </List>
  )
}
export default OrderListCompoent