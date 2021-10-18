import * as React from 'react';
import { Admin, Resource, DataProvider, EditGuesser, ListGuesser } from 'react-admin';
import { OrderList } from './components/orderList';
import buildGraphQLProvider from './buildQuery';
import { UserList } from './components/userList';
import { UserEdit } from './components/updateUser';
const App = () => {
  const [dataProvider, setDataProvider] = React.useState<DataProvider | null>(null);
    React.useEffect(() => {
      buildGraphQLProvider
            .then(graphQlDataProvider => setDataProvider(() => graphQlDataProvider));
    }, []);

  if (dataProvider === null) {
    return <div>Loading </div>;
  }

  return (
    <Admin dataProvider={dataProvider} >
      <Resource name="Order" list={OrderList} />
      <Resource name="User" list={UserList} />
      {/* <Resource name="BodyType"/> */}
    </Admin>
  );
}

export default App;
