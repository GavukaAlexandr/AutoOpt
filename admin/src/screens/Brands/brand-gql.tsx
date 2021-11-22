import gql from "graphql-tag";

export const BRAND_LIST_OF_TYPE = gql`
  query allBrandsOfType($page: Int, $perPage: Int, $filter: BrandFilter) {
    allBrandsOfType(page: $page, perPage: $perPage, filter: $filter) {
      id
      name
    }
  }
`;

export const BRAND_LIST = gql`
  query allBrands(
    $page: Int
    $perPage: Int
    $sortField: String
    $sortOrder: String
    $filter: BrandFilter
  ) {
    allBrands(
      page: $page
      perPage: $perPage
      sortField: $sortField
      sortOrder: $sortOrder
      filter: $filter
    ){
      id
      name
    }
    allBrandsMeta(sortField: "id", sortOrder: "desc", filter: $filter) {
      count
    }
  }
`;

export const BRAND_UPDATE = gql`
  mutation updateBrand(
    $id: ID
    $name: String
  ) {
    updateBrand(
      id: $id,
      name: $name
    ) {
      id
    }
  }
`;

export const CREATE_BRAND = gql`
  mutation createBrand(
    $name: String
  ) {
    createBrand(
      name: $name
    ) {
      id
    }
  }
`;