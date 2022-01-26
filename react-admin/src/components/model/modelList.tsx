import {
  ArrayField,
  ChipField,
  Datagrid,
  List,
  ReferenceArrayField,
  ReferenceInput,
  SingleFieldList,
  TextField,
  TextInput,
  SelectInput,
} from "react-admin";

const modelFilters = [
  <TextInput source="q" label="Name" alwaysOn />,
  <ReferenceInput source="brandIds" label="Brand" reference="Brand" allowEmpty>
    <SelectInput optionText="name" />
  </ReferenceInput>,
  <ReferenceInput source="typeIds" label="Type" reference="Type" allowEmpty>
    <SelectInput optionText="name" />
  </ReferenceInput>,
];

export const ModelList = (props) => (
  <List {...props} filters={modelFilters}>
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
