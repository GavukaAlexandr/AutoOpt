import * as React from "react";
import {
  AutocompleteArrayInput,
  AutocompleteInput,
  Create,
  ReferenceArrayInput,
  ReferenceInput,
  SelectArrayInput,
  SimpleForm,
  TextInput,
} from "react-admin";

export const ModelCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <ReferenceInput
        label="Type"
        reference="Type"
        perPage={100}
        source="typeIds"
      >
        <AutocompleteInput debounce={250} />
      </ReferenceInput>

      <ReferenceInput
        label="Brand"
        reference="Brand"
        perPage={100}
        source="brandIds"
      >
        <AutocompleteInput debounce={250} />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);
