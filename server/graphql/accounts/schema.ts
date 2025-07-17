import { gql } from 'apollo-server-express';

export const schema = gql`
  type Account {
    _id: ID!
    name: String!
    email: String!
    createdAt: String
    updatedAt: String
  }

  type AccountConnection {
    accounts: [Account!]!
    totalCount: Int!
  }

  input CreateAccountInput {
    name: String!
    email: String!
  }

  extend type Query {
    account(id: ID!): Account
    accounts(page: Int, perPage: Int, name: String): AccountConnection!
  }

  extend type Mutation {
    createAccount(input: CreateAccountInput!): Account!
  }
`;
