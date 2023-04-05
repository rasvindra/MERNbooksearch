const { AuthenticationError } = require('apollo-server-express');
const { Book, User } = require("../models");
const { signToken } = require('../utils/auth');
const { GraphQLError } = require("graphql");

const resolvers = {
    Query: {
           me: async (parent, { userName }, context) => {
      if (context.user) {
        return await User.findOne({ _id:context.user._id });
      }
      throw new GraphQLError("Please log in to view your Bookcase!", {
        extensions: {
          code: "UNAUTHENTICATED",
        },
    });
    },
    },

    // Mutation: {
    // addUser: async (
    //   parent,
    //   { userName, email, password }
    // ) => {
    //   const user = await User.create({
    //     userName,
    //     email,
    //     password,
    //   });
    //   const token = signToken(user);
    //   return { token, user };
    // },
    // login: async (parent, { email, password }) => {
    //   const user = await User.findOne({ email });

    //   if (!user) {
    //     throw new GraphQLError(
    //       "Sorry, No User found with the Email Provided!",
    //       {
    //         extensions: {
    //           code: "UNAUTHENTICATED",
    //         },
    //       }
    //     );
    //   }

    //   const correctPw = await user.isCorrectPassword(password);

    //   if (!correctPw) {
    //     throw new GraphQLError(
    //       "Incorrect password or email!",
    //       {
    //         extensions: {
    //           code: "UNAUTHENTICATED",
    //         },
    //       }
    //     );
    //   }

    //   const token = signToken(user);

    //   return { token, user };
    // },


    
    // saveBook: async (parent, { book }, context) => {
    //         if (context.user) {
    //           const book = await Book.create({
    //             authors,
    //             description,
    //             bookId,
    //             image,
    //             link,
    //             title
    //           });
      
    //           await User.findOneAndUpdate(
    //             { _id: context.user._id },
    //             { $addToSet: { avedBooks: {book} } }
    //           );
      
    //           return book;
    //         }
    //         throw new AuthenticationError("Please log in First!");
    //       },

          
    //       removeBook: async (parent, { bookId }, context) => {
    //         if (context.user) {
    //           const book = await Book.findOneAndDelete({
    //             _id: bookId,
    //             authors,
    //             description,
    //             image,
    //             link,
    //             title,
    //           });
      
    //           await User.findOneAndUpdate(
    //             { _id: context.user._id },
    //             { $pull: { book: book._id } }
    //           );
      
    //           return book;
    //         }
    //         throw new AuthenticationError("Please log in First!");
    //       },


    // },

    Mutation: {
      addUser: async (parent, args) => {
          const user = await User.create(args);
          const token = signToken(user);

          return { token, user };
      },
      login: async (parent, { email, password }) => {
          const user = await User.findOne({ email });

          if (!user) {
              throw new GraphQLError("No user with this email found!", {
                  extensions: {
                      code: "UNAUTHENTICATED",
                  },
              });
          };

          const correctPw = await user.isCorrectPassword(password);

          if (!correctPw) {
              throw new GraphQLError("Incorrect password!", {
                  extensions: {
                      code: "UNAUTHENTICATED",
                  },
              });
          };

          const token = signToken(user);
          return { token, user };
      },
      saveBook: async (parent, { book }, context) => {
          console.log(context);
          if (context.user) {
              return User.findOneAndUpdate(
                  { _id: context.user._id },
                  { $addToSet: { savedBooks: { book } } },
                  {
                      new: true,
                      runValidators: true
                  }
              );
          };

          throw new GraphQLError("You need to be logged in!", {
              extensions: {
                  code: "UNAUTHENTICATED",
              },
          });
      },
      removeBook: async (parent, { book }, context) => {
          if (context.user) {
              return User.findOneAndUpdate(
                  { _id: context.user._id},
                  { $pull: { savedBooks: book } },
                  { new: true }
              );
          };

          throw new GraphQLError("You need to be logged in!", {
              extensions: {
                  code: "UNAUTHENTICATED",
              },
          });
      }
  }
};


module.exports = resolvers;