import { useNavigate } from "react-router-dom";
import "../../styles/NewsCard.css"; 
import { formatToDisplay } from "../../utils/dataUtils";

function NewsCard({ news }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/news/${news.id}`);
  };

  return (
    <div className="news-card" onClick={handleCardClick}>
      <div className="news-card__image-wrapper">
        <img 
          src={news.imageUri || "placeholder.jpg"} 
          alt={news.title}
          className="news-card__image"
        />
        {news.theme && (
          <span className="news-card__category">{news.theme}</span>
        )}
      </div>
      
      <div className="news-card__content">
        <h3 className="news-card__title">{news.title}</h3>
        <p className="news-card__description">
          {news.subtitle?.substring(0, 100)}
          {news.subtitle?.length > 100 ? "..." : ""}
        </p>
        <div className="news-card__footer">
        <span className="news-card__date">
            { news.date || '' }
          </span>
        </div>
      </div>
    </div>
  );
}

export default NewsCard;