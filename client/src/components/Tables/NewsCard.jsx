import React from 'react';
import '../styles/NewsCard.css';

function NewsCard({ title, subtitle, text, imageUri, creatorName, date, link }) {
  return (
    <div className="news-card">
      {/* Фото новини */}
      {imageUri && <img src={imageUri} alt={title} className="news-card_image" />}

      {/* Контент */}
      <div className="news-card_content">
        <h2 className="news-card_title">{title}</h2>
        <p className="news-card_subtitle">{subtitle}</p>

        {/* Приховане поле text для детальної сторінки */}
        <div style={{ display: 'none' }}>{text}</div>

        <p className="news-card_meta">
          {creatorName} — {date}
        </p>

        {link && (
          <button
            className="news-card_button"
            onClick={() => window.location.href = link}
          >
            Детальніше
          </button>
        )}
      </div>
    </div>
  );
}

export default NewsCard;