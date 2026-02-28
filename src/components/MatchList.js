import React from 'react';
import MatchCard from './MatchCard';
import { useTranslation } from '../contexts/LanguageContext';

const MatchList = ({ matches, isFromAPI = false, activeFilter, onViewToday }) => {
  const { t } = useTranslation();

  if (!matches || matches.length === 0) {
    const isYesterdayOrTomorrow = activeFilter === 'yesterday' || activeFilter === 'tomorrow';
    return (
      <div className="no-matches">
        <p>{t('matches.noMatches')}</p>
        {isFromAPI && (
          <div className="no-matches-info">
            <p>{t('matches.noMatchesInfo')}</p>
            {isYesterdayOrTomorrow && onViewToday && (
              <button type="button" className="no-matches-try-today" onClick={onViewToday}>
                {t('matches.viewToday')}
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="match-list">
      {matches.map((match, index) => (
        <MatchCard key={match.id || `match-${index}`} match={match} />
      ))}
    </div>
  );
};

export default MatchList;

