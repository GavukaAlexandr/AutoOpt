import * as React from "react";
import {
  Create,
  ReferenceArrayInput,
  SelectArrayInput,
  SimpleForm,
  TextInput,
  required
} from "react-admin";

export const BrandCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Create>
);
