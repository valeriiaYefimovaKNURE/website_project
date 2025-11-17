import React, { useEffect, useState, useCallback } from 'react'
import UserTable from '../components/Tables/UserTable';
import NewsTable from '../components/Tables/NewsTable';
import CommentsTable from '../components/Tables/CommentsTable';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { fetchComments, createComment, handleSaveCommentsData, handleDeleteCommentsData } from '../utils/firebase/comments';
import { fetchNews, createNews, handleSaveNewsData, handleDeleteNewsData } from '../utils/firebase/news';
import { fetchUsers, createUser, handleSaveUserData, handleDeleteUserData } from '../utils/firebase/users';
import '../styles/AdminPage.css'; 

function AdminPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [selectedText, setSelectedText] = useState("Users");
  const [users, setUsers] = useState([]);
  const [news, setNews] = useState([]);
  const [comments, setComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Помилка завантаження користувачів:", error);
    }
  }, []);

  const loadNews = useCallback(async () => {
    try {
      const newsData = await fetchNews();
      setNews(newsData);
    } catch (error) {
      console.error("Помилка завантаження новин:", error);
    }
  }, []);

  const loadComments = useCallback(async () => {
    try {
      const commentsData = await fetchComments();
      setComments(commentsData);
    } catch (error) {
      console.error("Помилка завантаження коментарів:", error);
    }
  }, []);

  const OnCreateUser = async (userData) => {
    await createUser(userData);
    await loadUsers();
  };

  const OnSaveUserData = async (row, updatedFields) => {
    await handleSaveUserData(row, updatedFields);
    await loadUsers();
  };

  const OnDeleteUserData = async (userId) => {
    await handleDeleteUserData(userId);
    await loadUsers();
  };

  const OnCreateNews = async (newsData) => {
    await createNews(newsData);
    await loadNews();
  };

  const OnSaveNewsData = async (row, updatedFields) => {
    await handleSaveNewsData(row, updatedFields);
    await loadNews();
  };

  const OnDeleteNewsData = async (id) => {
    await handleDeleteNewsData(id);
    await loadNews();
  };

  const OnCreateComment = async (commentData) => {
    await createComment(commentData);
    await loadComments();
  };

  const OnSaveCommentsData = async (row, updatedFields) => {
    await handleSaveCommentsData(row, updatedFields);
    await loadComments();
  };

  const OnDeleteCommentsData = async (id) => {
    await handleDeleteCommentsData(id, comments);
    await loadComments();
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (selectedText === "Users") {
      loadUsers();
    } else if (selectedText === "News") {
      loadNews();
    } else if (selectedText === "Comments") {
      loadComments();
    }
  }, [selectedText, loadUsers, loadNews, loadComments]);

  if (!user) {
    return (
      <div className="admin-loading">
        <h1 className="admin-loading-text">Завантаження...</h1>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-user-info">
          <div className="admin-user-avatar">
            {getInitials(user.name)}
          </div>
          <span>
            <strong>{user.name}</strong> - {user.login}
          </span>
        </div>
        <button onClick={() => navigate("/")} className="btn-home">
          На головну
        </button>
      </div>

      <div className="admin-content">
        <h1 className="admin-title">Панель адміністратора</h1>

        <div className="admin-tabs">
          <button
            onClick={() => setSelectedText("Users")}
            className={`admin-tab ${selectedText === "Users" ? "active" : ""}`}
          >
            👥 Користувачі
          </button>
          <button
            onClick={() => setSelectedText("News")}
            className={`admin-tab ${selectedText === "News" ? "active" : ""}`}
          >
            📰 Новини
          </button>
          <button
            onClick={() => setSelectedText("Comments")}
            className={`admin-tab ${selectedText === "Comments" ? "active" : ""}`}
          >
            💬 Коментарі
          </button>
          <button
            onClick={() => setSelectedText("Reports")}
            className={`admin-tab ${selectedText === "Reports" ? "active" : ""}`}
          >
            🚨 Скарги
          </button>
        </div>

        <div className="admin-search-container">
          <input
            className="admin-search"
            type="search"
            placeholder="🔍 Пошук..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {selectedText && (
          <h2 className="admin-section-title">
            {selectedText === "Users" && "Управління користувачами"}
            {selectedText === "News" && "Управління новинами"}
            {selectedText === "Comments" && "Управління коментарями"}
            {selectedText === "Reports" && "Управління скаргами"}
          </h2>
        )}

        <div className="admin-table-container">
        
          {selectedText === "Users" && (
            users && users.length > 0 ? (
              <UserTable
                users={users}
                onCreate={OnCreateUser}
                onSave={OnSaveUserData}
                onDelete={OnDeleteUserData}
              />
            ) : (
              <div className="admin-empty-state">
                <p className="admin-empty-text">Немає користувачів</p>
              </div>
            )
          )}

          {selectedText === "News" && (
            news && news.length > 0 ? (
              <NewsTable
                news={news}
                onSave={OnSaveNewsData}
                onDelete={OnDeleteNewsData}
                onCreate={OnCreateNews}
              />
            ) : (
              <div className="admin-empty-state">
                <p className="admin-empty-text">Немає новин</p>
              </div>
            )
          )}

      
          {selectedText === "Comments" && (
            comments && comments.length > 0 ? (
              <CommentsTable
                comments={comments}
                onSave={OnSaveCommentsData}
                onDelete={OnDeleteCommentsData}
                onCreate={OnCreateComment}
              />
            ) : (
              <div className="admin-empty-state">
                <p className="admin-empty-text">Немає коментарів до дописів</p>
              </div>
            )
          )}

        
          {selectedText === "Reports" && (
            <div className="admin-empty-state">
              <p className="admin-empty-text">Функціонал скарг поки що в розробці</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
