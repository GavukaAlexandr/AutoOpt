import * as React from "react";
import { List, Datagrid, TextField, DateField } from 'react-admin';
export const OrderList = props => (
  <List {...props}>
      <Datagrid rowClick="edit">
          <TextField source="transmission" />
          <TextField source="bodyType" />
          <TextField source="drive" />
          <DateField source="year" />
          <TextField source="engineVolume" />
          <TextField source="vin" />
          <TextField source="carPart" />
          <TextField source="status" />
          <TextField source="fuel" />
          <TextField source="part" />
          <TextField source="createdAt" />
          <TextField source="updatedAt" />
      </Datagrid>
  </List>
);
