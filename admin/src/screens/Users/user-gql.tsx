import gql from "graphql-tag";

export const USER_UPDATE = gql`
  mutation updateUser($updateUserInput: UpdateUserInput) {
    updateUser(updateUserInput: $updateUserInput) {
        id
    }
  }
`;
