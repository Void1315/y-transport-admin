import React from 'react'
import {
  Create,
  //   LongTextInput,
  SimpleForm,
  TextInput
  //@ts-ignore
} from "react-admin";
const CreateCompoent = (props: JSX.IntrinsicAttributes) => {
  return <Create {...props}>
    <SimpleForm>
      <TextInput source="path_json" />
    </SimpleForm>
  </Create>
}
export default CreateCompoent;