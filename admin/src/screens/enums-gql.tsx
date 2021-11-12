import gql from "graphql-tag";

export const STATUSES = gql`
  query __type($name: String!) {
    __type(name: $name) {
      enumValues {
        name
        }
    }
  }
`;

export const TRANSMISSIONS = gql`
  query __type($name: String!) {
    __type(name: $name) {
      enumValues {
        name
        }
    }
  }
`;

export const PART_TYPES = gql`
  query __type($name: String!) {
    __type(name: $name) {
      enumValues {
        name
        }
    }
  }
`;

export const DRIVE_TYPES = gql`
  query __type($name: String!) {
    __type(name: $name) {
      enumValues {
        name
        }
    }
  }
`;

export const BODY_TYPES = gql`
  query __type($name: String!) {
    __type(name: $name) {
      enumValues {
        name
        }
    }
  }
`;

export const FUEL_TYPES = gql`
  query __type($name: String!) {
    __type(name: $name) {
      enumValues {
        name
        }
    }
  }
`;
