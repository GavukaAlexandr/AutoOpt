import gql from "graphql-tag";

export const BRAND_LIST_OF_TYPE = gql`
  query allBrandsOfType(
    $page: Int
    $perPage: Int
    $filter: BrandFilter,
  ) {
    allBrandsOfType(
      page: $page
      perPage: $perPage
      filter: $filter
    ) {
      id
      name
    }
  }
`;