import { gql } from '@apollo/client';

export const QUERY_USER_INFO = gql`
  query users {
    users {
      _id
      username
      email
      savedBooks {
        authors
        token
        _id
        description
        bookId
        image
        link
        title
      }
    }
  }
`;

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      savedBooks {
        authors
        token
        _id
        description
        bookId
        image
        link
        title
      }
    }
  }
`;

export const QUERY_ME = gql`
  query me($username: String!) {
    me(username: $username) {
      _id
      username
      email
      savedBooks {
        authors
        token
        _id
        description
        bookId
        image
        link
        title
      }
    }
  }
`;

// export const QUERY_ME = gql`
//     query me {
//         me {
//             _id
//             username
//             email
//             savedBooks {
//                 bookId
//                 authors
//                 description
//                 title
//             }
//         }
//     }
// `