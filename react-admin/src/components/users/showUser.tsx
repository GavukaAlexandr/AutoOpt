import {
  TextField,
  ArrayField,
  BooleanField,
  Datagrid,
  DateField,
  EmailField,
  ReferenceArrayField,
  Show,
  SimpleShowLayout,
  FunctionField,
  ChipField,
} from "react-admin";

export const UserShow = (props) => (
  <Show {...props} title="User">
    <SimpleShowLayout>
    <ReferenceArrayField source="ordersIds" label="Orders" reference="Order">
        <Datagrid >
          <TextField source="carPart" />
          <TextField source="modelId" /> //! needed REFERENCE FIELD in order to show name of Model
          {/* <TextField source="bodyType" /> */}
          <TextField source="carPart" />
          <TextField source="drive" />
          <TextField source="engineVolume" />
          <ChipField source="fuel" />
          <ChipField source="part" />
          <TextField source="status" />
          <TextField source="transmission" />
          <TextField source="vin" />
          <TextField source="year" />
          <DateField source="updatedAt" />
          <DateField source="createdAt" />
        </Datagrid>
      </ReferenceArrayField>
      <FunctionField
        label="Name"
        render={(record) => `${record.firstName} ${record.lastName}`}
      />
      <TextField source="phoneNumber" />
      <EmailField source="email" />
      <BooleanField source="phoneNotification" />
      <BooleanField source="telegramNotification" />
      <BooleanField source="viberNotification" />
      <DateField source="createdAt" />
      {/* <ArrayField source="orders"><Datagrid><TextField source="id" /></Datagrid></ArrayField> */}
    </SimpleShowLayout>
  </Show>
);
