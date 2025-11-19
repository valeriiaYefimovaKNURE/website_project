import { useState, useEffect, useMemo } from "react";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { fetchNews, fetchThemes } from "../utils/firebase/news";
import NewsCard from "../components/Tables/NewsCard";
import ArrayButtons from "../components/Buttons/ArrayButtons";
import { sortByDateAsc, sortByDateDesc } from "../utils/dataUtils";
import icons from "../constants/icons";
import { useFetchData } from "../utils/hooks/useFetchData";

function HomePage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState('Всі');
  const [sortDirection, setSortDirection] = useState("desc");

  const { data, isLoading, error } = useFetchData({
    news: fetchNews,
    themes: fetchThemes
  });

  const { news = [], themes = [] } = data;

  const filteredPosts=useMemo(()=>{
    return selectedTheme==='Всі' ? news : news.filter((item)=>item.theme===selectedTheme);
  },[news,selectedTheme]);

  const sortedPosts = useMemo(() => {
    if (sortDirection === "desc") {
      return sortByDateDesc([...filteredPosts]);
    } else {
      return sortByDateAsc([...filteredPosts]);
    }
  }, [filteredPosts, sortDirection]);

  const handleSortClick = () => {
    setSortDirection(prev => prev === "desc" ? "asc" : "desc");
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-md flex items-center justify-between px-6 py-4 z-50">
        <div className="flex space-x-6">
          <a>Me.We.Women</a>
          <a>Про додаток</a>
          <a>Топ</a>
          <a>Завантажити</a>
        </div>

        <img src="mepower_logo.png" className="mepower-logo" />

        <div className="flex flex-row space-x-6 items-center">
          <p className="">{user?.name}</p>
          {user ? (
            <button onClick={() => navigate("/admin")}>Адмінська панель</button>
          ) : (
            <button onClick={() => navigate("/auth")}>Увійти</button>
          )}
        </div>
      </header>

      <main className="pt-20">
        <section className="hero-banner flex items-center justify-between px-5 py-16 max-w-6xl mx-auto">
          <div className="hero-text w-1/2 pr-8">
            <h1 className="hero-text_title">Привіт, ми - Me.We.Women</h1>
            <p className="hero-text_subtitle">
              Платформа для натхнення, розвитку та підтримки українських жінок.
            </p>
          </div>

          <div className="hero-image w-1/2">
            <img src="banner.jpg" className="hero-image_img" />
          </div>
        </section>

        {/* Текст перед новинами */}
        <section className="news-intro">
          <h2 className="news-intro_title ">
            Останні новини та статті
          </h2>
          <p className="news-intro_subtitle">
          Дізнавайтесь про найсвіжіші події та цікаві матеріали на нашій платформі! Не забудьте підписатися, і ми повідомимо вас про всі новини першими.
          </p>
        </section>



          {/* Секція з новинами */}
          <section className="news-section">
          {isLoading && (
            <div className="news-loading">
              <p>Завантаження новин...</p>
            </div>
          )}

          {error && (
            <div className="news-error">
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && news.length === 0 && (
            <div className="news-empty">
              <p>Новин поки що немає</p>
            </div>
          )}

          {!isLoading && !error && news.length > 0 && (
            <>
              <ArrayButtons
                itemArray={themes}
                selectedItem={selectedTheme}
                onItemSelect={(item)=>setSelectedTheme(item)}
                defaultItemText='Всі'
              />
              <div className="sort-container">
                <p  className="sort-text">Сортувати за датою</p>
                <img
                  src={icons.arrows_vertical}
                  alt="Vertical Arrows"
                  className="w-10 h-10 cursor-pointer"
                  onClick={handleSortClick}
                />
              </div>
              
              <div className="news-grid">
                {sortedPosts.map((item) => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default HomePage;
