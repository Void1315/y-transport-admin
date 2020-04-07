import React from 'react'
//@ts-ignore
import { required,RichTextInput, Edit, SimpleForm, TextInput, DateInput, LongTextInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton } from 'react-admin';
import {Map,Marker} from 'react-amap'

const EditCompoent = (props: any) => {
  return (
    <Edit title={"asd"} {...props}>
      <SimpleForm>
        <TextInput label="Id" disabled source="id" />
        <TextInput source="path_json" validate={required()} />
        <div style={{width:300,height:500}}>
          <Map amapkey={"722458940738295f8c529ecd3037af98"} version={"1.4.15"} />
        </div>
        {/* <LongTextInput source="teaser" validate={required()} />
        <RichTextInput source="body" validate={required()} />
        <DateInput label="Publication date" source="published_at" />
        <ReferenceManyField label="Comments" reference="comments" target="post_id">
          <Datagrid>
            <TextField source="body" />
            <DateField source="created_at" />
            <EditButton />
          </Datagrid>
        </ReferenceManyField> */}
      </SimpleForm>
    </Edit>
  )
}
export default EditCompoent;