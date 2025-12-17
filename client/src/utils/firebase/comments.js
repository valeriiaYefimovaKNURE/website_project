import axios from "axios";

const API_URL = "https://localhost:8080/graphql";

const graphqlRequest = async (query, variables = {}) => {
  try {
    const response = await axios.post(API_URL, { query, variables });
    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data;
  } catch (error) {
    console.error("GraphQL Error:", error.message);
    throw error;
  }
};

// 1. Отримання всіх коментарів для адмінки
export const fetchComments = async () => {
  const query = `
    query {
      getAllComments {
        id
        text
        user_login
        date
        status
        news_id
        reason
        time
      }
    }
  `;
  const data = await graphqlRequest(query);
  return data.getAllComments;
};

// 2. Отримання коментарів для конкретної новини
export const fetchCommentsByNewsId = async (newsId) => {
  const query = `
    query GetComments($newsId: ID!) {
      getCommentsByNewsId(newsId: $newsId) {
        id
        text
        user_login
        date
        status
      }
    }
  `;
  const data = await graphqlRequest(query, { newsId });
  return data.getCommentsByNewsId;
};

// 3. Створення коментаря
export const createComment = async (commentData) => {
  const mutation = `
    mutation CreateComment($newsId: ID!, $input: CommentInput!) {
      createComment(newsId: $newsId, input: $input) {
        id
        text
        user_login
        date
      }
    }
  `;

  // Розділяємо дані: newsId окремо, решту полів — в input
  const { news_id, ...inputData } = commentData;

  const variables = {
    newsId: news_id, // передаємо ID новини як перший аргумент
    input: {
      text: inputData.text,
      user_uid: inputData.user_uid,
      user_login: inputData.user_login,
      user_name: inputData.user_login, // або залиш порожнім, якщо немає окремого поля
      date: inputData.date
    }
  };

  return await graphqlRequest(mutation, variables);
};

export const handleSaveCommentsData = async (row, updatedFields) => {
  const mutation = `
    mutation UpdateCommentReport($newsId: ID!, $commentId: ID!, $status: String, $reason: String) {
      updateCommentReport(newsId: $newsId, commentId: $commentId, status: $status, reason: $reason)
    }
  `;
  return await graphqlRequest(mutation, {
    newsId: row.news_id,
    commentId: row.id,
    ...updatedFields
  });
};

export const handleDeleteCommentsData = async (id, commentsArray) => {
  const comment = commentsArray.find(c => c.id === id);
  if (!comment) throw new Error("Коментар не знайдено");

  const mutation = `
    mutation DeleteComment($newsId: ID!, $commentId: ID!) {
      deleteComment(newsId: $newsId, commentId: $commentId)
    }
  `;
  return await graphqlRequest(mutation, { 
    newsId: comment.news_id, 
    commentId: id 
  });
};