const { gql } = require('apollo-server-express');

const { 
  getAllNews, 
  getNewsById, 
  getAllThemes, 
  createNews, 
  updateNewsData, 
  deleteNewsData 
} = require("../lib/FirebaseNews");

const {
  getAllComments,
  getCommentsByNewsId,
  updateComment,
  createComment,
  deleteComment,
  getReportedComments,
  updateCommentReport
} = require("../lib/FirebaseComments");

const {
  getIsNewsLiked,
  createLike,
  deleteLike
} = require("../lib/FirebaseLikes");

const typeDefs = gql`
  type Report {
    reportId: ID
    reason: String
    status: String
    time: String
  }

  type Comment {
    id: ID!
    text: String
    user_uid: String
    user_login: String
    user_name: String
    news_id: ID
    date: String
    hasReport: Boolean
    reports: [Report]
    reason: String
    status: String
    time: String
  }

  type News {
    id: ID!
    title: String!
    content: String
    subtitle: String 
    theme: String
    date: String
    creatorLogin: String
    creatorName: String
    creatorUid: String
    imageUri: String
    likes: Int
    link: String
    isActual: Boolean
    commentsArray: [Comment] 
  }

  type Query {
    getAllNews: [News]
    getNewsById(id: ID!): News
    getThemes: [String]
    
    getAllComments: [Comment]
    getCommentsByNewsId(newsId: ID!): [Comment]
    getReportedComments: [Comment]
    
    isNewsLiked(userId: ID!, newsId: ID!): Boolean
  }

  input NewsInput {
    title: String!
    subtitle: String!
    content: String
    theme: String
    date: String
    creatorName: String
    creatorLogin: String   
    creatorUid: String   
    imageUri: String
    link: String        
    isActual: Boolean      
    likes: Int
  }

  input CommentInput {
    text: String!
    user_uid: String!
    user_login: String
    user_name: String
    date: String
  }

  type Mutation {
    createNews(input: NewsInput!): News
    updateNews(id: ID!, title: String,subtitle: String, content: String, theme: String, imageUri: String, link: String, isActual: Boolean): News
    deleteNews(id: ID!): Boolean
    
    createComment(newsId: ID!, input: CommentInput!): Comment
    updateComment(newsId: ID!, commentId: ID!, text: String, status: String): Boolean
    deleteComment(newsId: ID!, commentId: ID!): Boolean
    updateCommentReport(newsId: ID!, commentId: ID!, status: String, reason: String): Boolean

    createLike(userId: ID!, newsId: ID!): News
    deleteLike(userId: ID!, newsId: ID!): News
  }
`;

// Резолвери
const resolvers = {
  Query: {
    getAllNews: async () => await getAllNews(),
    getNewsById: async (_, { id }) => await getNewsById(id),
    getThemes: async () => await getAllThemes(),
    
    getAllComments: async () => await getAllComments(),
    getCommentsByNewsId: async (_, { newsId }) => await getCommentsByNewsId(newsId),
    getReportedComments: async () => await getReportedComments(),
    
    isNewsLiked: async (_, { userId, newsId }) => await getIsNewsLiked(userId, newsId),
  },

  Mutation: {
    createNews: async (_, { input }) => await createNews(input),
    
    updateNews: async (_, { id, ...updatedFields }) => {
      await updateNewsData(id, updatedFields);
      return await getNewsById(id);
    },
    
    deleteNews: async (_, { id }) => {
      await deleteNewsData(id);
      return true;
    },

    createComment: async (_, { newsId, input }) => await createComment(newsId, input),
    
    updateComment: async (_, { newsId, commentId, ...fields }) => {
      await updateComment(newsId, commentId, fields);
      return true;
    },
    
    deleteComment: async (_, { newsId, commentId }) => {
      await deleteComment(newsId, commentId);
      return true;
    },

    updateCommentReport: async (_, { newsId, commentId, ...fields }) => {
      await updateCommentReport(newsId, commentId, fields);
      return true;
    },

    createLike: async (_, { userId, newsId }) => {
      await createLike(userId, newsId);
      return await getNewsById(newsId);
    },

    deleteLike: async (_, { userId, newsId }) => {
      await deleteLike(userId, newsId);
      return await getNewsById(newsId);
    }
  }
};

module.exports = { typeDefs, resolvers };