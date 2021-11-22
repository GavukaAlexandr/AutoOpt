import gql from "graphql-tag";

export const TYPE_LIST = gql`
  query allTypes(
    $page: Int
    $perPage: Int
    $sortField: String
    $sortOrder: String
  ) {
    allTypes(
      page: $page
      perPage: $perPage
      sortField: $sortField
      sortOrder: $sortOrder
    ) {
      id
      name
    }
    allOrdersMeta(sortField: "id", sortOrder: "asc", filter: {}) {
      count
    }
  }
`;

export const CREATE_TYPE = gql`
  mutation createType(
    $name: String
  ) {
    createType(
      name: $name
    ) {
      id
    }
  }
`;

export const UPDATE_TYPE = gql`
  mutation updateType(
    $name: String
    $id: ID
  ) {
    updateType(
      id: $id
      name: $name
    ) {
      id
    }
  }
`;
