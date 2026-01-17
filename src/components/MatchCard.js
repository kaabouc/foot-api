import React from 'react';
import './MatchCard.css';
import { useTranslation } from '../contexts/LanguageContext';

const MatchCard = ({ match }) => {
  const { t } = useTranslation();

  const formatTime = (time) => {
    return time;
  };

  const getStatusText = (status) => {
    if (status === 'finished') return t('match.finished');
    if (status === 'live') return t('match.live');
    return t('match.notStarted');
  };

  const getStatusClass = (status) => {
    if (status === 'finished') return 'status-finished';
    if (status === 'live') return 'status-live';
    return 'status-not-started';
  };

  return (
    <div className="match-card">
      <div className="match-card-left">
        <div className="team-info">
          {match.team1.logo ? (
            <img src={match.team1.logo} alt={match.team1.name} className="team-logo" onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }} />
          ) : null}
          <div className="team-logo-placeholder" style={{ display: match.team1.logo ? 'none' : 'flex' }}>
            {match.team1.name.charAt(0)}
          </div>
          <div className="team-name">{match.team1.name}</div>
        </div>
        <div className="league-info">
          {match.leagueLogo ? (
            <img src={match.leagueLogo} alt={match.league} className="league-logo" onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'inline';
            }} />
          ) : null}
          <span className="trophy-icon" style={{ display: match.leagueLogo ? 'none' : 'inline' }}>🏆</span>
          <span className="league-name">{match.league}</span>
        </div>
      </div>

      <div className="match-card-center">
        <div className="match-time">
          <span className="time-label">PM</span>
          <span className="time-value">{formatTime(match.time)}</span>
        </div>
        <div className={`match-status ${getStatusClass(match.status)}`}>
          {getStatusText(match.status)}
        </div>
        {match.status === 'finished' && (
          <div className="match-score">
            <span className="score">{match.score.team1}</span>
            <span className="score-separator">-</span>
            <span className="score">{match.score.team2}</span>
          </div>
        )}
        <div className="commentator-info">
          <span className="microphone-icon">🎤</span>
          <span className="commentator-name">{match.commentator}</span>
        </div>
      </div>

      <div className="match-card-right">
        <div className="team-info">
          {match.team2.logo ? (
            <img src={match.team2.logo} alt={match.team2.name} className="team-logo" onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }} />
          ) : null}
          <div className="team-logo-placeholder" style={{ display: match.team2.logo ? 'none' : 'flex' }}>
            {match.team2.name.charAt(0)}
          </div>
          <div className="team-name">{match.team2.name}</div>
        </div>
        <div className="channel-info">
          <span className="tv-icon">📺</span>
          <span className="channel-name">{match.channel}</span>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;

