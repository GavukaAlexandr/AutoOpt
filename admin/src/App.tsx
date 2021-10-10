import * as React from 'react';

import buildGraphQLProvider from 'ra-data-graphql';
import { Admin, Resource, ListGuesser } from 'react-admin';
import { InMemoryCache, ApolloClient } from '@apollo/client';
import buildQuery from './buildQuery';
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
    })
      .then(dataProvider => {
      setDataProvider(() => dataProvider )
      });
  }, []);

  if (dataProvider === null) {
    return <div>Loading </div>;
  }

  return (
    <Admin dataProvider={dataProvider} >
      <Resource name="orders" list={ListGuesser} />
    </Admin>
  );
}

export default App;
