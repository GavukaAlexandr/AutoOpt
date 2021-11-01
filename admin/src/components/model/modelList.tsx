import {
  ArrayField,
  ChipField,
  Datagrid,
  List,
  ReferenceArrayField,
  SingleFieldList,
  TextField,
} from "react-admin";

export const ModelList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <ReferenceArrayField source="typeIds" reference="Type" sortable={false}>
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ReferenceArrayField>
      <ReferenceArrayField source="brandIds" reference="Brand" sortable={false}>
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ReferenceArrayField>
    </Datagrid>
  </List>
);
