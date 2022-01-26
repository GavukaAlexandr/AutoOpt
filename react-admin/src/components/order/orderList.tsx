import gql from "graphql-tag";
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
import { gqlClient } from "../../GqlClient";

import OrderShow from "./orderShow";

let getStatusList = async () => {

  const preparedData = await gqlClient.query({
    query: gql`
      query {
        __type(name: "OrderStatus") {
          enumValues {
            name
          }
        }
      }
    `,
  });

  const { enumValues } = preparedData.data.__type;
  const orderStatuses = enumValues.map((value) => ({
    id: value.name,
    name: value.name,
  }));

  return orderStatuses;
};

export const OrderList = (props) => {
  const [statusList, setStatusList] = React.useState();

  React.useEffect(() => {
    async function name() {
      let result = await getStatusList();
      setStatusList(result);
    }
    name();
  }, []);

  return (
    <List
      {...props}
      pagination={<Pagination rowsPerPageOptions={[15, 25, 50, 100]} />}
    >
      <Datagrid expand={<OrderShow statusList={statusList} />}>
        <ReferenceField source="modelId" reference="Model">
          <TextField source="name" />
        </ReferenceField>
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
};
