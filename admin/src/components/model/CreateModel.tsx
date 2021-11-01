import * as React from "react";
import {
  Create,
  ReferenceArrayInput,
  SelectArrayInput,
  SimpleForm,
  TextInput,
} from "react-admin";

export const ModelCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <ReferenceArrayInput source="typeIds" reference="Type">
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Create>
);
