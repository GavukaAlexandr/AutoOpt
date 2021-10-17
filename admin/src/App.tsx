import * as React from 'react';
import buildGraphQLProvider from 'ra-data-graphql';
import { Admin, Resource, ListGuesser } from 'react-admin';
import { InMemoryCache, ApolloClient } from '@apollo/client';
import buildQuery from './buildQuery';
import { OrderList } from './components/orderList';
const { useState } = React;

const App = () => {

  const [dataProvider, setDataProvider] = useState(null);

  const client = new ApolloClient({
    uri: 'http://localhost:3000/graphql',
    cache: new InMemoryCache()
  });

  React.useEffect(() => {
    buildGraphQLProvider({
      client,
      buildQuery,
      introspection: {
        include: ['Order', 'User'],
      }
    })
      .then((dataProvider) => {
      setDataProvider(() => dataProvider )
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (dataProvider === null) {
    return <div>Loading </div>;
  }

  return (
    <Admin dataProvider={dataProvider} >
      <Resource name="Order" list={OrderList} />
      <Resource name="User" list={ListGuesser} />
    </Admin>
  );
}

export default App;
