import * as React from "react";
import {
  ChipField,
  Datagrid,
  EditButton,
  List,
  ReferenceArrayField,
  SingleFieldList,
  TextField,
} from "react-admin";

export const BrandList = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="name" />
        <ReferenceArrayField source="typeIds" reference="Type" sortable={false}>
          <SingleFieldList>
            <ChipField source="name" />
          </SingleFieldList>
        </ReferenceArrayField>
        <EditButton />
      </Datagrid>
    </List>
  );
};
