import * as React from "react";
import {
  ChipField,
  Datagrid,
  EditButton,
  List,
  ReferenceArrayField,
  SingleFieldList,
  TextField,
  TextInput,
} from "react-admin";

const brandFilters = [
  <TextInput source="q" label="Name" alwaysOn />,
];

export const BrandList = (props) => {
  return (
    <List {...props} filters={brandFilters}>
      <Datagrid>
        <TextField source="name" />
        <ReferenceArrayField source="typeIds" reference="Type" sortable={false}>
          <SingleFieldList>
            <ChipField source="name" />
          </SingleFieldList>
        </ReferenceArrayField>
      </Datagrid>
    </List>
  );
};
