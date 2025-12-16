import React from 'react'
import "../styles/Footer.css"; 


const Footer = () => {
    return (
      <footer className="footer">
        <div className="footer-container">
  
          <div className="footer-brand">
            <h2 className="footer-logo">Me.We.Women</h2>
            <p>
              Надихаюча платформа для статей, підтримки та розвитку жінок.
            </p>
          </div>
  
          <div className="footer-columns">
  
            <div className="footer-column">
              <h4>Соціальні мережі</h4>
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">Pinterest</a>
              <a href="#">Instagram</a>
            </div>
  
            <div className="footer-column">
              <h4>Про нас</h4>
              <a href="#">Про платформу</a>
              <a href="#">Можливості</a>
              <a href="#">Контакти</a>
              <a href="#">Політика конфіденційності</a>
            </div>
  
            <div className="footer-column">
              <h4>Матеріали</h4>
              <a href="#">Події</a>
              <a href="#">Блог та новини</a>
              <a href="#">FAQ</a>
              <a href="#">Відгуки</a>
            </div>
  
            <div className="footer-column">
              <h4>Акаунт</h4>
              <a href="#">Підписка</a>
              <a href="#">Мій профіль</a>
              <a href="#">Теги</a>
              <a href="#">Автори</a>
            </div>
  
          </div>
        </div>
  
        <div className="footer-bottom">
          © {new Date().getFullYear()} Me.We.Women. Усі права захищені.
        </div>
      </footer>
    );
  };
  
  export default Footer;