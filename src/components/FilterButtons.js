import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const FilterButtons = ({ activeFilter, onFilterChange }) => {
  const { t } = useTranslation();

  return (
    <div className="filter-buttons-container">
      <div className="timezone-info">{t('filters.timezone')}</div>
      <div className="filter-buttons">
        <button
          className={`filter-btn filter-yesterday ${activeFilter === 'yesterday' ? 'active' : ''}`}
          onClick={() => onFilterChange('yesterday')}
        >
          {t('filters.yesterday')}
        </button>
        <button
          className={`filter-btn filter-today ${activeFilter === 'today' ? 'active' : ''}`}
          onClick={() => onFilterChange('today')}
        >
          {t('filters.today')}
        </button>
        <button
          className={`filter-btn filter-tomorrow ${activeFilter === 'tomorrow' ? 'active' : ''}`}
          onClick={() => onFilterChange('tomorrow')}
        >
          {t('filters.tomorrow')}
        </button>
      </div>
    </div>
  );
};

export default FilterButtons;

