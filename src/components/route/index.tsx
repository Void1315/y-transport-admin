import React from 'react'
//@ts-ignore
import { List, Datagrid, TextField } from "react-admin";
const RouteCompoent = (props: JSX.IntrinsicAttributes) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="body" />
      </Datagrid>
    </List>
  )
}
export default RouteCompoent;