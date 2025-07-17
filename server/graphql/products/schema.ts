import { gql } from 'apollo-server-express';

export const schema = gql`
  type Product {
    _id: ID!
    name: String!
    sku: String!
    stock: Int!
    accountId: ID!
    account: Account
    createdAt: String
    updatedAt: String
  }

  input CreateProductInput {
    name: String!
    sku: String!
    stock: Int!
    accountId: ID!
  }

  input PurchaseProductInput {
    accountId: ID!
    productId: ID!
    quantity: Int!
  }

  type PurchaseResponse {
    success: Boolean!
    message: String!
    product: Product
  }

  extend type Query {
    product(id: ID!): Product
    productsByAccount(accountId: ID!): [Product!]!
  }

  extend type Mutation {
    createProduct(input: CreateProductInput!): Product!
    purchaseProduct(input: PurchaseProductInput!): PurchaseResponse!
  }
`;
