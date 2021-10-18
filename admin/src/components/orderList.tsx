import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
  ArrayInput,
  SimpleFormIterator,
  TextInput,
  ArrayField,
  SingleFieldList,
  ChipField,
} from "react-admin";

import { cloneElement } from 'react'

export const StringToLabelObject = ({ record, children, ...rest }) =>
  cloneElement(children, {
    record: { label: record },
    ...rest,
  })

export const OrderList = (props) => (
  <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="bodyType" />
            <TextField source="carPart" />
            <DateField source="createdAt" />
            <TextField source="drive" />
            <DateField source="engineVolume" />
            <TextField source="fuel" />
            <TextField source="id" />
            {/* <ReferenceField source="modelId" reference="models"><TextField source="id" /></ReferenceField> */}
            <TextField source="part" />
            <TextField source="status" />
            <TextField source="transmission" />
            <DateField source="updatedAt" />
            <ReferenceField source="userId" reference="User"><TextField source="id" /></ReferenceField>
            <TextField source="vin" />
            <DateField source="year" />
        </Datagrid>
    </List>
);
