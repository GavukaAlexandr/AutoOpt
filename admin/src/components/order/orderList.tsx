import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
  FunctionField,
  BooleanField,
  Pagination,
} from "react-admin";

import OrderShow from "./orderShow";

export const OrderList = (props) => (
  <List
    {...props}
    pagination={<Pagination  rowsPerPageOptions={[15, 25, 50, 100]} />}
  >
    <Datagrid expand={<OrderShow />}>
      <TextField source="modelId" />
      <TextField source="carPart" />
      <ReferenceField source="userId" reference="User">
        <FunctionField
          render={(record) => `${record.firstName} ${record.lastName}`}
        />
      </ReferenceField>
      <ReferenceField
        label="Phone"
        source="userId"
        reference="User"
        link={false}
      >
        <BooleanField source="phoneNotification" />
      </ReferenceField>
      <ReferenceField
        label="Viber"
        source="userId"
        reference="User"
        link={false}
      >
        <BooleanField source="viberNotification" />
      </ReferenceField>
      <ReferenceField
        label="Telegram"
        source="userId"
        reference="User"
        link={false}
      >
        <BooleanField source="telegramNotification" />
      </ReferenceField>
      <DateField source="createdAt" />
      <TextField source="status" />
    </Datagrid>
  </List>
);
