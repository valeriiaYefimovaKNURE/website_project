import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchNewsById } from '../utils/firebase/news';
import { fetchCommentsByNewsId, createComment } from '../utils/firebase/comments';
import { useUser } from '../context/UserContext';
import '../styles/NewsDetailPage.css';

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewersCount, setViewersCount] = useState(0);


  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const newsData = await fetchNewsById(id);
        if (!newsData) {
          setError("Новину не знайдено");
          return;
        }
        setArticle(newsData);

        const commentsData = await fetchCommentsByNewsId(id);
        setComments(commentsData);
      } catch (err) {
        console.error("Помилка завантаження:", err);
        setError("Не вдалося завантажити дані");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  //  (WebSocket)

  useEffect(() => {
    let ws;

    try {
      ws = new WebSocket("wss://alyssa-unpeevish-unchicly.ngrok-free.dev ");
      ws.onopen = () => {
        console.log("WebSocket підключено успішно");
        ws.send(JSON.stringify({ type: "join", data: { news_id: id } }));
      };

      ws.onerror = (event) => {
        console.error("WebSocket closed:", event);
      };

      ws.onclose = (event) => {
        console.log("WebSocket закрито", event.code, event.reason);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
  
          // Оновлюємо кількість глядачів
          if (message.type === "viewers_count" && message.data.news_id === id) {
            setViewersCount(message.data.count);
          }
          // Оновлюємо коментарі
          if (message.type === "new_comment") {
            const comment = message.data;

            if (comment.news_id === id) {
              setComments(prev => [...prev, comment]);
            }
          }
        } catch (err) {
          console.error("Помилка обробки повідомлення WS:", err);
        }
      };
    } catch (err) {
      console.error("Не вдалося створити WebSocket:", err);
    }

    return () => {
      if (ws) ws.close();
    };
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setArticle(prev => ({
      ...prev,
      likes: isLiked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    if (!user) {
      alert("Для додавання коментарів потрібно увійти");
      return;
    }

    try {
      const comment = {
        text: newComment,
        user_login: user.login || user.name || user.email || "Анонім",
        date: new Date().toLocaleDateString('uk-UA'),
        status: "pending",
        news_id: id,
        user_uid: user.id,
        hasReport: false
      };
      console.log("Sending comment:", user); 


      //const newCommentId = await addComment(comment);
      const newCommentId = await createComment(comment);

    //  setComments([...comments, { ...comment, id: newCommentId }]);
      setNewComment("");
    } catch (err) {
      console.error("Помилка додавання коментаря:", err);
      alert("Не вдалося додати коментар");
    }
  };

  const getThemeClass = (theme) => {
    const themeMap = {
      "ЛГБТКІА": "theme-lgbtq",
      "Спорт": "theme-sport",
      "Соціальне": "theme-social",
      "Історія": "theme-history",
      "Активізм": "theme-activism",
      "Освіта": "theme-education",
      "Новини": "theme-news",
      "Психологія": "theme-psychology"
    };
    return themeMap[theme] || "theme-default";
  };

  if (loading) {
    return (
      <div className="news-detail-loading">
        <p>Завантаження...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="news-detail-error">
        <div className="error-content">
          <p>{error || "Новину не знайдено"}</p>
          <button onClick={() => navigate('/')} className="btn-back-home">
            На головну
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-detail-page">
      <div className="news-detail-container">
        <div className="news-detail-header">
          <button onClick={() => navigate('/')} className="btn-back">
            <svg className="icon-back" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        </div>

        {/* Image */}
        {article.imageUri && (
          <div className="news-detail-image">
            <img src={article.imageUri} alt={article.title} />
          </div>
        )}

        {/* Content */}
        <div className="news-detail-content">
          {/* Theme and Date */}
          <div className="news-meta">
            {article.theme && (
              <span className={`theme-badge ${getThemeClass(article.theme)}`}>
                {article.theme}
              </span>
            )}
            <span className="news-date">{article.date}</span>
          </div>

          {/* Stats */}
          <div className="news-stats">
            <button 
              onClick={handleLike}
              className={`stat-item stat-likes ${isLiked ? 'liked' : ''}`}
            >
              <svg className={`icon-heart ${isLiked ? 'filled' : ''}`} viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <span>{article.likes || 0}</span>
            </button>
            <div className="stat-item">
              <svg className="icon-comment" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>{comments.length}</span>
            </div>
            <p>Зараз переглядають: {viewersCount} {viewersCount === 1 ? "особа" : "осіб"}</p>

          </div>

          {/* Title */}
          <h1 className="news-title">{article.title}</h1>

          {/* Author */}
          {article.creatorName && (
            <div className="news-author">
              <p className="author-label">Автор(-ка)</p>
              <div className="author-info">
                <div className="author-avatar">
                  <span>👤</span>
                </div>
                <p className="author-name">{article.creatorName}</p>
              </div>
            </div>
          )}

          {/* Description */}
          {article.subtitle && (
            <div className="news-description">
              <p className="description-label">Опис</p>
              <div className="description-text">{article.subtitle}</div>
            </div>
          )}

          {/* Link */}
          {article.link && (
            <div className="news-link">
              <a href={article.link} target="_blank" rel="noopener noreferrer">
                Читати повну версію →
              </a>
            </div>
          )}

          {/* Comments Section */}
          <div className="comments-section">
            <h2 className="comments-title">Коментарі ({comments.length})</h2>

            {/* Comments List */}
            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="comments-empty">Коментарів поки немає. Будьте першим!</p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-avatar">
                      <span>{comment.user_login ? comment.user_login[0].toUpperCase() : '?'}</span>
                    </div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <p className="comment-author">{comment.user_login || 'Анонім'}</p>
                        <span className="comment-date">{comment.date}</span>
                        {comment.status === "pending" && (
                          <span className="comment-status">На модерації</span>
                        )}
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment */}
            <div className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={user ? "Додати коментар..." : "Увійдіть, щоб залишити коментар"}
                disabled={!user}
                className="comment-input"
                rows="3"
              />
              <div className="comment-actions">
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || !user}
                  className="btn-submit-comment"
                >
                  <svg className="icon-send" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Надіслати
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailPage;