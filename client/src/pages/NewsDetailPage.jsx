import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchNewsById } from '../utils/firebase/news';
import { fetchCommentsByNewsId, createComment } from '../utils/firebase/comments';
import { useUser } from '../context/UserContext';
import '../styles/NewsDetailPage.css';
import icons from "../constants/icons";
import useWebSocket from '../utils/hooks/useWebSocket';
import { useFetchData } from '../utils/hooks/useFetchData';

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const { data, isLoading, error, refetch } = useFetchData({
    article: () => fetchNewsById(id),
    comments: () => fetchCommentsByNewsId(id)
  });
  const { article = null, comments: initialComments = [] } = data;
  const [comments, setComments] = useState(initialComments);
  const [articleState, setArticleState] = useState(null);

  const { viewersCount, newComment: wsNewComment, isConnected } = useWebSocket(id);


  // Оновлюємо коментарі, коли вони завантажилися
  useEffect(() => {
    if (initialComments.length > 0) {
      setComments(initialComments);
    }
  }, [initialComments]);

  //Новий коментар з WebSocket
  useEffect(() => {
    if (wsNewComment) {
      setComments(prev => {
        const exists = prev.some(c => 
          c.id === wsNewComment.id || 
          (c.text === wsNewComment.text && c.date === wsNewComment.date && c.user_uid === wsNewComment.user_uid)
        );
        
        if (exists) return prev;
        return [...prev, wsNewComment];
      });
    }
  }, [wsNewComment]);

  useEffect(() => {
    if (article) {
      setArticleState(article);
    }
  }, [article]);


  const handleLike = () => {
    setIsLiked(!isLiked);
    setArticleState(prev => ({
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
        user_login: user.login || "Анонім",
        date: new Date().toLocaleDateString('uk-UA'),
        status: "pending",
        news_id: id,
        user_uid: user.id,
        hasReport: false
      };
      console.log("Sending comment:", user); 

      await createComment(comment);

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

  if (isLoading) {
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
            <img 
              src={icons.back_arrow_black}
            />
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
              <img className={`icon-heart ${isLiked ? 'filled' : ''}`} fill={isLiked ? "currentColor" : "none"}
                src={isLiked? icons.icon_like_pressed : icons.icon_like}
              />
              <span>{articleState?.likes || 0}</span>
            </button>
            <div className="stat-item">
              <img className="icon-comment"
                src={icons.icon_comment}
              />
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
                comments.map((comment, index) => (
                  <div key={comment.id || `comment-${index}`} className="comment-item">
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
                )))}
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