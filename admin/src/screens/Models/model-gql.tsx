import gql from "graphql-tag";

export const MODEL_LIST = gql`
  query allModels(
    $page: Int
    $perPage: Int
    $sortField: String
    $sortOrder: String
    $filter: ModelFilter,
  ) {
    allModels(
      page: $page
      perPage: $perPage
      sortField: $sortField
      sortOrder: $sortOrder
      filter: $filter
    ) {
      id
      name
    }
  }
`;
