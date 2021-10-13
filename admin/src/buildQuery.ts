import { gql } from '@apollo/client';
function buildFieldList(introspectionResults, resource, raFetchType) {
  return resource.type.fields.map((m) => m.name).join('\n')
}

const buildQuery = introspectionResults => (raFetchType, resourceName, params) => {
  const resource = introspectionResults.resources.find(r => { 
    console.log(r);
    
    return r.type.name === resourceName
  });

  switch (raFetchType) {
  case 'GET_LIST':
    return {
      query: gql`query { ${resource[raFetchType].name} {
                   ${buildFieldList(introspectionResults, resource, raFetchType)}
                }}`,
      variables: params, // params = { id: ... }
      parseResponse: response => {
        return {
          data: response.data[resource[raFetchType].name],
          total: 10
        }
      },
    }

  default:
    break
  }
}

export default buildQuery;
