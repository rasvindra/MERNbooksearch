const { AuthenticationError } = require('apolo-server-express');
const { Book, User } = require("../models")
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        users: async () => {
            return User.find().populate("books")
        },

        user: async (parent, { username }) => {
            return User.findOne({ username }).populate("books")
        },
        books: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Book.find(params)
        },
        book: async (parent, { username }) => {
            return Book.findOne({ _id: bookId });
        },
        me: async (parent, args, context) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id }).populate('books');
            }
            throw new AuthenticationError("Please log in First!");
          },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
          },
          login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError("No user was found with this email address");
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError("Sorry.Incorrect credentials!");
            }
      
            const token = signToken(user);
      
            return { token, user };
          },
          saveBook: async (parent, { authors,description,bookId,image,link,title }, context) => {
            if (context.user) {
              const book = await Book.create({
                authors,
                description,
                bookId,
                image,
                link,
                title
              });
      
              await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { books: book._id } }
              );
      
              return book;
            }
            throw new AuthenticationError("Please log in First!");
          },
          removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
              const book = await Book.findOneAndDelete({
                _id: bookId,
                authors,
                description,
                image,
                link,
                title,
              });
      
              await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { book: book._id } }
              );
      
              return book;
            }
            throw new AuthenticationError("Please log in First!");
          },


    },
};


module.exports = resolvers;