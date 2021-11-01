import * as React from "react";
import { Edit, ReferenceArrayInput, SelectArrayInput, SimpleForm, TextInput } from "react-admin";

export const BrandEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput label="Name" source="name" />
      <ReferenceArrayInput source="typeIds" reference="Type">
        <SelectArrayInput optionText="name"/>
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
);
