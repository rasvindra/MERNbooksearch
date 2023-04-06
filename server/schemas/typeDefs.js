const { gql } = require("apollo-server-express")

const typeDefs = `#graphql
    type User {
     _id: ID
     username: String!
     email: String!
     bookCount: String
     password: String
     savedBooks: [String]
    },

    type Book {
     authors: [String]
     description: String
     bookId: String!
     image: String
     link: String
     title: String
    }

    type Auth {
     token: ID!
     user: User
    }

    type Query {
     me: User
    
    }

    type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(authors: String, description: String!, bookId: String!, image: String, link: String, title: String! ): User
    removeBook(bookId: ID!): User
   
  }


`;

module.exports = typeDefs;