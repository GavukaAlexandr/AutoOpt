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
      <ReferenceArrayInput source="typeIds" reference="Type">
        <SelectArrayInput optionText="name" validate={[required()]}/>
      </ReferenceArrayInput>
      {/* <TextInput source="model"/> */}
      {/* <TextInput source =""/> */}
      {/* <ReferenceInput></ReferenceInput> */}
    </SimpleForm>
  </Create>
);
