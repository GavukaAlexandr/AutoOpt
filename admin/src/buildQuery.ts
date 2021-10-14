import { gql } from "@apollo/client";
function buildFieldList(introspectionResults, resource, raFetchType) {
  return resource.type.fields.map((m) => m.name).join('\n')
}

const buildQuery = introspectionResults => (raFetchType, resourceName, params) => {
  const resource = introspectionResults.resources.find(r => {
    console.log(r);
    return r.type.name === resourceName;
  });

  switch (raFetchType) {
    case 'GET_LIST':
      return {
        query: gql`query { ${resource[raFetchType].name} {
                     ${buildFieldList(introspectionResults, resource, raFetchType)}
                  }}`,
        variables: {
          page: params.page,
          perPage: params.perPage,
          sortField: params.sort.field,
          sortOrder: params.sort.order
        },
        parseResponse: response => {
          return {
            data: response.data[resource[raFetchType].name],
            total: 10
          }
        },
      }
      case 'GET_ONE':
        return {
          query: gql`query ${resource[raFetchType].name}($id: ID!) {
                    ${resource[raFetchType].name} (id: $id) {
                       ${buildFieldList(introspectionResults, resource, raFetchType)}
                    }}`,
          variables: params, // params = { id: ... }
          parseResponse: response => {
            return {
              data: response.data[resource[raFetchType].name],
            }
          },
        }
    default:
      break
  }
}

export default buildQuery;
