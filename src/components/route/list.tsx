import React from 'react'
//@ts-ignore
import { List, Datagrid, TextField,TextInput,ReferenceInput,SelectInput,Filter } from "react-admin";
export const ListCompoent = (props: JSX.IntrinsicAttributes) => {
  return (
    <List {...props} filters={<MyFilter />}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="path_json" />
      </Datagrid>
    </List>
  )
}

const MyFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search" source="path_json" alwaysOn />
    <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
      <SelectInput optionText="name" />
    </ReferenceInput>
  </Filter>
);