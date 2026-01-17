import React, { useState } from 'react';
import './Header.css';
import { useTranslation } from '../contexts/LanguageContext';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { language, changeLanguage, t } = useTranslation();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <div className="language-selector">
            <button
              className={`lang-btn ${language === 'ar' ? 'active' : ''}`}
              onClick={() => changeLanguage('ar')}
              title="العربية"
            >
              عربي
            </button>
            <button
              className={`lang-btn ${language === 'fr' ? 'active' : ''}`}
              onClick={() => changeLanguage('fr')}
              title="Français"
            >
              FR
            </button>
          </div>
        </div>
        <div className="logo-section">
          <h1 className="logo-text">koora live</h1>
          <span className="logo-text-arabic">كورة لايف</span>
        </div>
        <button className="koora-button">
          koora live ©
        </button>
      </div>
    </header>
  );
};

export default Header;

