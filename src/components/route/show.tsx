import React from 'react';
//@ts-ignore
import { Show, SimpleShowLayout, TextField, DateField, EditButton, RichTextField } from 'react-admin';
export const ShowCompoent = (props: JSX.IntrinsicAttributes) => {
  return (
    <Show title="Post view" {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="path_json" />
        <RichTextField source="body" />
        <DateField label="Publication date" source="created_at" />
      </SimpleShowLayout>
    </Show>
  )
}