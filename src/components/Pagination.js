import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Afficher toutes les pages si moins de 5
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique pour afficher les pages avec ellipses
      if (currentPage <= 3) {
        // Début : afficher 1, 2, 3, 4, ..., dernière
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Fin : afficher 1, ..., avant-dernière, dernière-1, dernière
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Milieu : afficher 1, ..., page-1, page, page+1, ..., dernière
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-container">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={t('pagination.previous')}
      >
        ‹ {t('pagination.previous')}
      </button>

      <div className="pagination-numbers">
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              className={`pagination-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
              aria-label={`الصفحة ${page}`}
              aria-current={currentPage === page ? 'page' : null}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={t('pagination.next')}
      >
        {t('pagination.next')} ›
      </button>
    </div>
  );
};

export default Pagination;

