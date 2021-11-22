import buildGraphQLProvider, { buildQuery } from 'ra-data-graphql-simple';
import { InMemoryCache, ApolloClient } from '@apollo/client';
import { gqlClient } from './GqlClient'

const myBuildQuery = introspection => (fetchType, resource, params) => {

    if (params.sort === undefined) return buildQuery(introspection)(fetchType, resource, params);
    switch (params.sort.order) {
        case 'ASC':
            params.sort.order = 'asc';
            break;
        case 'DESC':
            params.sort.order = 'desc';
            break;
        default:
            break;
    }

    const builtQuery = buildQuery(introspection)(fetchType, resource, params);
    return builtQuery;
};

export default buildGraphQLProvider({ buildQuery: myBuildQuery, client: gqlClient })