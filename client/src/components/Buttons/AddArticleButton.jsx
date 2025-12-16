import { useNavigate } from 'react-router-dom';
import '../../styles/AddArticleButton.css';

const AddArticleButton = ({ to = "/create" }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(to);
    };

    return (
        <button className="add-article-btn" onClick={handleClick}>
            <div className="btn-icon">
                <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        d="M12 5V19M5 12H19" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <span className="btn-text">Додати статтю</span>
        </button>
    );
};

export default AddArticleButton;