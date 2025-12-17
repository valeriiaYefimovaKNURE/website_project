import axios from "axios";

const API_URL = "https://localhost:8080/graphql";

const graphqlRequest = async (query, variables = {}) => {
  try {
    const response = await axios.post(API_URL, { query, variables });
    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data;
  } catch (error) {
    console.error("GraphQL Error (Likes):", error.message);
    throw error;
  }
};

export const fetchIsNewsLiked = async (userId, newsId) => {
  const query = `
    query CheckLike($userId: ID!, $newsId: ID!) {
      isNewsLiked(userId: $userId, newsId: $newsId)
    }
  `;
  const data = await graphqlRequest(query, { userId, newsId });
  return data.isNewsLiked; 
};

export const fetchCreateLike = async (userId, newsId) => {
  const mutation = `
    mutation AddLike($userId: ID!, $newsId: ID!) {
      createLike(userId: $userId, newsId: $newsId) {
        id
        likes
      }
    }
  `;
  return await graphqlRequest(mutation, { userId, newsId });
};

export const fetchDeleteLike = async (userId, newsId) => {
  const mutation = `
    mutation RemoveLike($userId: ID!, $newsId: ID!) {
      deleteLike(userId: $userId, newsId: $newsId)
    }
  `;
  const data = await graphqlRequest(mutation, { userId, newsId });
  return data.deleteLike;
};