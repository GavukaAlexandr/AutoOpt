import {
  Datagrid,
  EditButton,
  List,
  TextField,
} from "react-admin";

export const TypeList = (props) => (
  <List {...props} bulkActionButtons={false}>
    <Datagrid>
      <TextField source="name" />
      {/* <EditButton /> */}
    </Datagrid>
  </List>
);
