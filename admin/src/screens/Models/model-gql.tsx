import gql from "graphql-tag";

export const MODEL_LIST = gql`
  query allModels(
    $page: Int
    $perPage: Int
    $sortField: String
    $sortOrder: String
    $filter: ModelFilter
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
      brand {
        id
        name
      }
      type {
        id
        name
      }
    }
    allModelsMeta(sortField: "id", sortOrder: "asc", filter: $filter) {
      count
    }
  }
`;

export const UPDATE_MODEL = gql`
  mutation updateModel(
    $id: ID
    $name: String
    $brand: ID
    $type: ID
  ) {
    updateModel(
      id: $id
      name: $name
      brand: $brand
      type: $type
    ){
      id
    }
  }
`;

export const CREATE_MODEL = gql`
  mutation createModel(
    $name: String
    $brandId: ID
    $typeId: ID
  ) {
    createModel(
      name: $name
      brandId: $brandId
      typeId: $typeId
    ){
      id
    }
  }
`;
