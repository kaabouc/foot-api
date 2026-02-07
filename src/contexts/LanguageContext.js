import React, { createContext, useState, useContext, useEffect } from 'react';
import arTranslations from '../locales/ar.json';
import frTranslations from '../locales/fr.json';

const LanguageContext = createContext();

const translations = {
  ar: arTranslations,
  fr: frTranslations,
};

export const LanguageProvider = ({ children, initialLanguage }) => {
  // SSR: use initialLanguage; client: use localStorage or initialLanguage
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return initialLanguage || 'ar';
    return initialLanguage || localStorage.getItem('app-language') || 'ar';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('app-language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    // Remplacer les paramètres dans la traduction
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey] !== undefined ? params[paramKey] : match;
    });
  };

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;

