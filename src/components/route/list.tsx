import React from 'react'
//@ts-ignore
import { List, Datagrid,DateField, TextField,TextInput,EditButton,ShowButton,Filter,DeleteButton } from "react-admin";
export const ListCompoent = (props: JSX.IntrinsicAttributes) => {
  return (
    <List {...props} filters={<MyFilter />}>
      <Datagrid>
        <TextField source="id" label="序号" />
        <TextField source="name" label="路线名称" />
        <TextField source="path_json" label="路径点" />
        <DateField source="created_at" label="创建日期" />
        <TextField source="comment" label="路线说明" />
        <EditButton />
        <ShowButton />
        <DeleteButton />
      </Datagrid>
    </List>
  )
}

const MyFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search" source="path_json" alwaysOn />
  </Filter>
);