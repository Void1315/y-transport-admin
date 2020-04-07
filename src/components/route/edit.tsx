import React from 'react'
//@ts-ignore
import { required,RichTextInput, Edit, SimpleForm, TextInput, DateInput, LongTextInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton } from 'react-admin';
import {Map,Marker} from 'react-amap'
//@ts-ignore
// const AMap = window.AMap;
const EditCompoent = (props: any) => {
  const events = {
    created: (map: any) => {
      //@ts-ignore
      AMap.plugin(["AMap.DragRoute"], function() {
        let path = []

        path.push([116.303843, 39.983412])
        path.push([116.321354, 39.896436])
        path.push([116.407012, 39.992093])
        //@ts-ignore
        let route = new AMap.DragRoute(map, path, AMap.DrivingPolicy.LEAST_FEE)
        route.search()
      });
    },
    click: () => {console.log('You Clicked The Map')}
  }
  return (
    <Edit title={"asd"} {...props}>
      <SimpleForm>
        <TextInput label="Id" disabled source="id" />
        <TextInput source="path_json" validate={required()} />
        <div style={{width:300,height:500}}>
          <Map amapkey={"722458940738295f8c529ecd3037af98"} version={"1.4.15"} events={events} />
        </div>
      </SimpleForm>
    </Edit>
  )
}
export default EditCompoent;