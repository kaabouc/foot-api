import React from 'react';
import MatchCard from './MatchCard';
import './MatchList.css';
import { useTranslation } from '../contexts/LanguageContext';

const MatchList = ({ matches, isFromAPI = false }) => {
  const { t } = useTranslation();

  console.log('🎯 MatchList rendered with:', {
    matchesCount: matches?.length || 0,
    isFromAPI: isFromAPI,
    matches: matches
  });
  
  if (!matches || matches.length === 0) {
    console.log('⚠️ MatchList: No matches to display');
    return (
      <div className="no-matches">
        <p>{t('matches.noMatches')}</p>
        {isFromAPI && (
          <div className="no-matches-info">
            <p>{t('matches.noMatchesInfo')}</p>
          </div>
        )}
      </div>
    );
  }

  console.log('✅ MatchList: Rendering', matches.length, 'match(es)');
  
  return (
    <div className="match-list">
      {matches.map((match, index) => {
        console.log(`🎴 Rendering match ${index + 1}:`, match);
        return <MatchCard key={match.id || `match-${index}`} match={match} />;
      })}
    </div>
  );
};

export default MatchList;

