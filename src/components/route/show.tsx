import React from 'react';
//@ts-ignore
import { Show, SimpleShowLayout, TextField, DateField, EditButton, RichTextField,ListButton,DeleteButton,RefreshButton  } from 'react-admin';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
export const ShowCompoent = (props: JSX.IntrinsicAttributes) => {
  console.log(props)
  return (
    //@ts-ignore
    <Show title="Post view" {...props} actions={<PostShowActions {...props} />}>
      <SimpleShowLayout>
        <TextField source="id" />
        <TextField source="path_json" />
        <RichTextField source="body" />
        <DateField label="Publication date" source="created_at" />
      </SimpleShowLayout>
    </Show>
  )
}
const cardActionStyle = {
  zIndex: 2,
  display: 'inline-block',
  float: 'right',
};
const PostShowActions = (props: { basePath: any; id:any, resource: any; }) => (
  <CardActions>
    <EditButton basePath={props.basePath} record={{id:props.id}}/>
    <ListButton basePath={props.basePath} />
    <DeleteButton basePath={props.basePath} record={{id:props.id}} resource={props.resource} />
    <RefreshButton />
    {/* Add your custom actions */}
    <Button color="primary" onClick={()=>{}}>Custom Action</Button>
  </CardActions>
);