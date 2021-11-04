import * as React from "react";
import { Edit, SimpleForm, TextInput } from "react-admin";

export const TypeEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput label="Name" source="name" />
    </SimpleForm>
  </Edit>
);
