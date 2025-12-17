const { gql } = require('apollo-server-express');
const { 
  getAllNews, 
  getNewsById, 
  getAllThemes, 
  createNews, 
  updateNewsData, 
  deleteNewsData 
} = require("../lib/FirebaseNews");

const typeDefs = gql`
  type News {
  id: ID!
  title: String!
  content: String
  subtitle: String 
  theme: String
  date: String
  creatorLogin: String
  imageUri: String
}

type Query {
  getAllNews: [News]
  getNewsById(id: ID!): News
  getThemes: [String]
}

input NewsInput {
  title: String!
  subtitle: String
  content: String!
  theme: String
  date: String
  creatorName: String
  imageUri: String
}

type Mutation {
  createNews(input: NewsInput!): News
  updateNews(id: ID!, title: String, content: String, theme: String, imageUri: String): News
  deleteNews(id: ID!): Boolean
}
`;

// Резолвери
const resolvers = {
  Query: {
    getAllNews: async () => await getAllNews(),
    getNewsById: async (_, { id }) => await getNewsById(id),
    getThemes: async () => await getAllThemes(),
  },
  Mutation: {
    createNews: async (_, { input }) => {
      return await createNews(input);
    },
    updateNews: async (_, { id, ...updatedFields }) => {
      await updateNewsData(id, updatedFields);
      return true;
    },
    deleteNews: async (_, { id }) => {
      await deleteNewsData(id);
      return true;
    }
  }
};

module.exports = { typeDefs, resolvers };
