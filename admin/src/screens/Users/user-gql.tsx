import gql from "graphql-tag";

export const USER_UPDATE = gql`
  mutation updateUser($updateUserInput: UpdateUserInput) {
    updateUser(updateUserInput: $updateUserInput) {
      id
    }
  }
`;

export const USER_LIST = gql`
  query allUsers(
    $page: Int
    $perPage: Int
    $sortField: String
    $sortOrder: String
    $filter: UserFilter
  ) {
    allUsers(
      page: $page
      perPage: $perPage
      sortField: $sortField
      sortOrder: $sortOrder
      filter: $filter
    ) {
      id
      orders {
        id
      }
      comment
      createdAt
      email
      firstName
      lastName
      phoneNotification
      phoneNumber
      telegramNotification
      viberNotification
    }
    allUsersMeta(sortField: "id", sortOrder: "asc", filter: $filter) {
      count
    }
  }
`;
