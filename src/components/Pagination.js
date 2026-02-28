import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTranslation();
  const pages = Math.max(1, totalPages);
  if (pages <= 0) return null;

  const getPageNumbers = () => {
    const pageList = [];
    const maxVisible = 5;

    if (pages <= maxVisible) {
      for (let i = 1; i <= pages; i++) {
        pageList.push(i);
      }
    } else {
      // Logique pour afficher les pages avec ellipses
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageList.push(i);
        }
        pageList.push('ellipsis');
        pageList.push(pages);
      } else if (currentPage >= pages - 2) {
        pageList.push(1);
        pageList.push('ellipsis');
        for (let i = pages - 3; i <= pages; i++) {
          pageList.push(i);
        }
      } else {
        pageList.push(1);
        pageList.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageList.push(i);
        }
        pageList.push('ellipsis');
        pageList.push(pages);
      }
    }

    return pageList;
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
        disabled={currentPage >= pages}
        aria-label={t('pagination.next')}
      >
        {t('pagination.next')} ›
      </button>
    </div>
  );
};

export default Pagination;

