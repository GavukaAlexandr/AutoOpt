import * as React from "react";
import {
  Admin,
  Resource,
  DataProvider,
} from "react-admin";
import buildGraphQLProvider from "./buildQuery";
import { UserList } from "./components/users/userList";
import { UserShow } from "./components/users/showUser";
import { OrderList } from "./components/order/orderList";
import { TypeList } from "./components/type/TypeList";
import { BrandList } from "./components/brand/BrandList";
import { ModelList } from "./components/model/modelList";
import UserIcon from "@material-ui/icons/PersonRounded";
import MyLayout from "./components/ui/Layout";
import { TypeCreate } from "./components/type/TypeCreate";
import { TypeEdit } from "./components/type/TypeEdit";
import { BrandCreate } from "./components/brand/BrandCreate";
import { BrandEdit } from "./components/brand/BrandEdit";
import { ModelCreate } from "./components/model/CreateModel";

const App = () => {
  const [dataProvider, setDataProvider] = React.useState<DataProvider | null>(
    null
  );
  React.useEffect(() => {
    buildGraphQLProvider.then((graphQlDataProvider) =>
      setDataProvider(() => graphQlDataProvider)
    );
  }, []);

  if (dataProvider === null) {
    return <div>Loading </div>;
  }

  return (
    <Admin dataProvider={dataProvider}  layout={MyLayout}>
      <Resource name="Type" list={TypeList} create={TypeCreate} edit={TypeEdit}/>
      <Resource name="Brand" list={BrandList} create={BrandCreate} />
      <Resource name="Model" list={ModelList} create={ModelCreate}/>
      <Resource name="Order" list={OrderList} />
      <Resource name="User" icon={UserIcon} list={UserList} show={UserShow} />
    </Admin>
  );
};

export default App;
