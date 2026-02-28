import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const FilterButtons = ({ activeFilter, onFilterChange }) => {
  const { t } = useTranslation();

  const handleClick = (filterKey) => {
    if (onFilterChange && filterKey !== activeFilter) {
      onFilterChange(filterKey);
    }
  };

  return (
    <div className="filter-buttons-container" role="group" aria-label={t('filters.timezone')}>
      <div className="timezone-info" aria-hidden="true">
        {t('filters.timezone')}
      </div>
      <div className="filter-buttons" role="tablist" aria-label="Filtrer par date">
        <button
          type="button"
          role="tab"
          aria-selected={activeFilter === 'yesterday'}
          className={`filter-btn filter-yesterday ${activeFilter === 'yesterday' ? 'active' : ''}`}
          onClick={() => handleClick('yesterday')}
        >
          {t('filters.yesterday')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeFilter === 'today'}
          className={`filter-btn filter-today ${activeFilter === 'today' ? 'active' : ''}`}
          onClick={() => handleClick('today')}
        >
          {t('filters.today')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeFilter === 'tomorrow'}
          className={`filter-btn filter-tomorrow ${activeFilter === 'tomorrow' ? 'active' : ''}`}
          onClick={() => handleClick('tomorrow')}
        >
          {t('filters.tomorrow')}
        </button>
      </div>
    </div>
  );
};

export default FilterButtons;

