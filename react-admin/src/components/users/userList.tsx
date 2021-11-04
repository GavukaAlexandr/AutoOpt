import {
  List,
  Datagrid,
  TextField,
  EmailField,
  SingleFieldList,
  BooleanField,
  ReferenceArrayField,
  NumberField,
  NumberFieldProps,
  useListContext,
  FunctionField,
  ArrayField,
} from "react-admin";

export const UserList = (props) => {
  return (
    <List {...props}>
      <Datagrid optimized > //!rowClick="show"
      <FunctionField label="Name" render={record => `${record.firstName} ${record.lastName}`} />
        <ArrayField source="orders" sortable={false} >
        <FunctionField render={record => `${record?.orders?.length}`} />
        </ArrayField>
        <TextField label="Phone" source="phoneNumber" />
        <EmailField source="email" />
        <BooleanField label="Telegram" source="telegramNotification" />
        <BooleanField label="Phone" source="phoneNotification" />
        <BooleanField label="Viber" source="viberNotification" />
      </Datagrid>
    </List>
  );
};
