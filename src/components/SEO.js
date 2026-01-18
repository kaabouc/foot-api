import { useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

// Composant pour gérer les meta tags SEO dynamiques
const SEO = ({ 
  title, 
  description, 
  keywords, 
  image,
  type = 'website',
  url 
}) => {
  const { language } = useTranslation();

  useEffect(() => {
    // Mettre à jour le titre
    if (title) {
      document.title = title;
    }

    // Mettre à jour les meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      if (!content) return;
      
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Meta description
    if (description) {
      updateMetaTag('description', description);
      updateMetaTag('og:description', description, true);
      updateMetaTag('twitter:description', description);
    }

    // Meta keywords
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Open Graph
    if (title) {
      updateMetaTag('og:title', title, true);
      updateMetaTag('twitter:title', title);
    }

    if (url) {
      updateMetaTag('og:url', url, true);
      updateMetaTag('twitter:url', url);
    }

    if (image) {
      updateMetaTag('og:image', image, true);
      updateMetaTag('twitter:image', image);
    }

    updateMetaTag('og:type', type, true);
    updateMetaTag('og:locale', language === 'ar' ? 'ar_MA' : 'fr_MA', true);

    // Canonical URL
    if (url) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
    }

    // Lang attribute
    document.documentElement.setAttribute('lang', language === 'ar' ? 'ar' : 'fr');
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');

  }, [title, description, keywords, image, type, url, language]);

  return null; // Ce composant ne rend rien
};

export default SEO;

