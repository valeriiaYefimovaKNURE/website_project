import { useState } from "react";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function HomePage() {
  const { user } = useUser();
  const navigate = useNavigate();

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
      </main>
    </>
  );
}

export default HomePage;
