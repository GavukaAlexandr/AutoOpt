import gql from "graphql-tag";

export const ORDERS_LIST = gql`
  query allOrders(
    $page: Int
    $perPage: Int
    $sortField: String
    $sortOrder: String
    $filter: OrderFilter
  ) {
    allOrders(
      page: $page
      perPage: $perPage
      sortField: $sortField
      sortOrder: $sortOrder
      filter: $filter
    ) {
      id
      status
      comment
      carPart
      model {
        id
        name
        type {
          id
          name
        }
        brand {
          id
          name
        }
      }
      user {
        id
        firstName
        lastName
        phoneNumber
      }
      createdAt
    }
    allOrdersMeta(sortField: "id", sortOrder: "asc", filter: $filter) {
      count
    }
  }
`;

export const ORDER = gql`
  query Order($id: ID) {
    Order(id: $id) {
      id
      status
      transmission
      carPart
      partOfType
      fuel
      createdAt
      bodyType
      drive
      comment
      engineVolume
      model {
        id
        name
        type {
          id
          name
        }
        brand {
          id
          name
        }
      }
      user {
        firstName
        lastName
        telegramNotification
        viberNotification
        phoneNotification
        phoneNumber
        email
        id
        comment
      }
    }
  }
`;

export const FIRST_ORDER = gql`
  query getFirstOrder(
    $sortField: String
    $sortOrder: String
  ) {
    getFirstOrder(
      sortField: $sortField
      sortOrder: $sortOrder
    ) {
      createdAt
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation updateOrder($id: ID!, $updateOrderInput: UpdateOrderInput) {
    updateOrder(id: $id, updateOrderInput: $updateOrderInput) {
      id
    }
  }
`;
