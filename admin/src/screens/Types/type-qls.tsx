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
  }
`;