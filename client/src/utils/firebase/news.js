import axios from "axios";

const API_URL = "https://localhost:8080/graphql";

const graphqlRequest = async (query, variables = {}) => {
  try {
    const response = await axios.post(API_URL, { query, variables });
    
    if (response.data.errors) {
      console.error("GraphQL Errors:", response.data.errors);
      throw new Error(response.data.errors[0].message);
    }
    
    return response.data.data;
  } catch (error) {
    console.error("Network/Server Error:", error.message);
    throw error;
  }
};

export const fetchNews = async () => {
  const query = `
    query {
      getAllNews {
        id
        title
        content
        theme
        date
        creatorLogin
        imageUri
        likes
      }
    }
  `;
  const data = await graphqlRequest(query);
  return data.getAllNews;
};

export const fetchNewsById = async (id) => {
  const query = `
    query GetNews($id: ID!) {
      getNewsById(id: $id) {
        id
        title
        content
        theme
        date
        imageUri
        likes
      }
    }
  `;
  const data = await graphqlRequest(query, { id });
  return data.getNewsById;
};

export const fetchThemes = async () => {
  const query = `
    query {
      getThemes
    }
  `;
  const data = await graphqlRequest(query);
  return data.getThemes;
};

export const createNews = async (newsData) => {
  const mutation = `
    mutation Create($input: NewsInput!) {
      createNews(input: $input) {
        id
        title
        content
      }
    }
  `;
  return await graphqlRequest(mutation, { input: newsData });
};

export const handleSaveNewsData = async (row, updatedFields) => {
  const mutation = `
    mutation UpdateNews($id: ID!, $title: String, $content: String, $theme: String, $imageUri: String) {
      updateNews(id: $id, title: $title, content: $content, theme: $theme, imageUri: $imageUri) {
        id
        title
      }
    }
  `;
  return await graphqlRequest(mutation, { id: row.id, ...updatedFields });
};

export const handleDeleteNewsData = async (id) => {
  const mutation = `
    mutation Delete($id: ID!) {
      deleteNews(id: $id)
    }
  `;
  return await graphqlRequest(mutation, { id });
};
