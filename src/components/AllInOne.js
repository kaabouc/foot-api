import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

// ========== HEADER ==========
export function Header({ serverTimezone }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { language, changeLanguage } = useTranslation();
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>{isDarkMode ? '☀️' : '🌙'}</button>
          <div className="language-selector">
            <button className={`lang-btn ${language === 'ar' ? 'active' : ''}`} onClick={() => changeLanguage('ar')} title="العربية">عربي</button>
            <button className={`lang-btn ${language === 'fr' ? 'active' : ''}`} onClick={() => changeLanguage('fr')} title="Français">FR</button>
          </div>
        </div>
        <div className="logo-section">
          <img src="/Logo.png" alt="Koora for the World - كورة للعالم" className="header-logo" />
          <h1 className="logo-text">Koora for the World</h1>
          <span className="logo-text-arabic">كورة للعالم</span>
          {serverTimezone && (
            <div className="timezone-info">
              <span className="timezone-label">🌍 {language === 'ar' ? 'المنطقة الزمنية' : 'Timezone'}:</span>
              <span className="timezone-value">{serverTimezone}</span>
            </div>
          )}
        </div>
        <button className="koora-button">Koora for the World ©</button>
      </div>
    </header>
  );
}

// ========== FILTER BUTTONS ==========
export function FilterButtons({ activeFilter, onFilterChange }) {
  const { t } = useTranslation();
  const handleClick = (filterKey) => {
    if (onFilterChange && filterKey !== activeFilter) onFilterChange(filterKey);
  };
  return (
    <div className="filter-buttons-container" role="group" aria-label={t('filters.timezone')}>
      <div className="timezone-info" aria-hidden="true">{t('filters.timezone')}</div>
      <div className="filter-buttons" role="tablist" aria-label="Filtrer par date">
        <button type="button" role="tab" aria-selected={activeFilter === 'today'} className={`filter-btn filter-today ${activeFilter === 'today' ? 'active' : ''}`} onClick={() => handleClick('today')}>{t('filters.today')}</button>
        <button type="button" role="tab" aria-selected={activeFilter === 'tomorrow'} className={`filter-btn filter-tomorrow ${activeFilter === 'tomorrow' ? 'active' : ''}`} onClick={() => handleClick('tomorrow')}>{t('filters.tomorrow')}</button>
      </div>
    </div>
  );
}

// ========== MATCH CARD ==========
function MatchCard({ match }) {
  const { t } = useTranslation();
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
          {match.team1.logo ? <img src={match.team1.logo} alt={match.team1.name} className="team-logo" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} /> : null}
          <div className="team-logo-placeholder" style={{ display: match.team1.logo ? 'none' : 'flex' }}>{match.team1.name.charAt(0)}</div>
          <div className="team-name">{match.team1.name}</div>
        </div>
      </div>
      <div className="match-card-center">
        <div className="match-time"><span className="time-value">{match.time}</span></div>
        <div className={`match-status ${getStatusClass(match.status)}`}>{getStatusText(match.status)}</div>
        {(match.status === 'finished' || match.status === 'live') && (
          <div className="match-score">
            <span className="score">{match.score.team1}</span><span className="score-separator">-</span><span className="score">{match.score.team2}</span>
          </div>
        )}
      </div>
      <div className="match-card-right">
        <div className="team-info team-info-right">
          {match.team2.logo ? <img src={match.team2.logo} alt={match.team2.name} className="team-logo" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} /> : null}
          <div className="team-logo-placeholder" style={{ display: match.team2.logo ? 'none' : 'flex' }}>{match.team2.name.charAt(0)}</div>
          <div className="team-name">{match.team2.name}</div>
        </div>
      </div>
    </div>
  );
}

// ========== LEAGUE GROUP ==========
function LeagueGroup({ league, leagueLogo, matches }) {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <div className={`league-group ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="league-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="league-header-left">
          {leagueLogo ? (
            <img src={leagueLogo} alt={league} className="league-header-logo" onError={(e) => { e.target.style.display = 'none'; }} />
          ) : (
            <span className="trophy-icon-header">🏆</span>
          )}
          <span className="league-header-name">{league}</span>
        </div>
        <div className="league-header-right">
          <span className="league-matches-count">{matches.length}</span>
          <span className="expand-icon">{isExpanded ? '▲' : '▼'}</span>
        </div>
      </div>
      {isExpanded && (
        <div className="league-matches">
          {matches.map((match, index) => (
            <MatchCard key={match.id || `match-${index}`} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}

// ========== MATCH LIST ==========
export function MatchList({ matches, isFromAPI = false, activeFilter, onViewToday }) {
  const { t, language } = useTranslation();
  if (!matches || matches.length === 0) {
    return (
      <div className="no-matches">
        <p>{t('matches.noMatches')}</p>
        {isFromAPI && activeFilter === 'tomorrow' && onViewToday && (
          <div className="no-matches-info">
            <button type="button" className="no-matches-try-today" onClick={onViewToday}>{t('matches.viewToday')}</button>
          </div>
        )}
      </div>
    );
  }

  // Group by country then by league
  const grouped = {};
  matches.forEach(match => {
    const country = match.country || (language === 'ar' ? 'دولي' : 'International');
    const league = match.leagueEn || match.league || (language === 'ar' ? 'غير معروف' : 'Unknown');
    if (!grouped[country]) grouped[country] = {};
    if (!grouped[country][league]) grouped[country][league] = { matches: [], leagueLogo: null };
    grouped[country][league].matches.push(match);
    if (!grouped[country][league].leagueLogo && match.leagueLogo) {
      grouped[country][league].leagueLogo = match.leagueLogo;
    }
  });

  const sortedCountries = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  return (
    <div className="match-list">
      {sortedCountries.map(country => (
        <div key={country} className="country-group">
          <div className="country-header">
            <span className="country-name">{country}</span>
            <span className="country-matches-total">
              {Object.values(grouped[country]).reduce((sum, l) => sum + l.matches.length, 0)}
            </span>
          </div>
          {Object.entries(grouped[country])
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([league, { matches: leagueMatches, leagueLogo }]) => (
              <LeagueGroup
                key={league}
                league={league}
                leagueLogo={leagueLogo}
                matches={leagueMatches}
              />
            ))}
        </div>
      ))}
    </div>
  );
}

// ========== PAGINATION ==========
export function Pagination({ currentPage, totalPages, onPageChange }) {
  const { t } = useTranslation();
  const pages = Math.max(1, totalPages);
  if (pages <= 0) return null;
  const getPageNumbers = () => {
    const pageList = [];
    const maxVisible = 5;
    if (pages <= maxVisible) {
      for (let i = 1; i <= pages; i++) pageList.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageList.push(i);
        pageList.push('ellipsis');
        pageList.push(pages);
      } else if (currentPage >= pages - 2) {
        pageList.push(1, 'ellipsis');
        for (let i = pages - 3; i <= pages; i++) pageList.push(i);
      } else {
        pageList.push(1, 'ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pageList.push(i);
        pageList.push('ellipsis', pages);
      }
    }
    return pageList;
  };
  const pageNumbers = getPageNumbers();
  return (
    <div className="pagination-container">
      <button className="pagination-btn" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} aria-label={t('pagination.previous')}>‹ {t('pagination.previous')}</button>
      <div className="pagination-numbers">
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
          return (
            <button key={page} className={`pagination-number ${currentPage === page ? 'active' : ''}`} onClick={() => onPageChange(page)} aria-current={currentPage === page ? 'page' : null}>{page}</button>
          );
        })}
      </div>
      <button className="pagination-btn" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= pages} aria-label={t('pagination.next')}>{t('pagination.next')} ›</button>
    </div>
  );
}

// ========== ADVANCED FILTERS ==========
const ALL_COUNTRIES = [
  'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Comoros', 'Congo', 'Congo DR', "Côte d'Ivoire", 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'São Tomé and Príncipe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe',
  'USA', 'Canada', 'Mexico', 'Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic', 'Trinidad and Tobago', 'Barbados', 'Bahamas', 'Antigua and Barbuda', 'Grenada', 'Saint Kitts and Nevis',
  'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Guyana', 'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela',
  'Afghanistan', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brunei', 'Cambodia', 'China', 'East Timor', 'India', 'Indonesia', 'Iran', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Lebanon', 'Malaysia', 'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'North Korea', 'Oman', 'Pakistan', 'Palestine', 'Philippines', 'Qatar', 'Saudi Arabia', 'Singapore', 'South Korea', 'Sri Lanka', 'Syria', 'Tajikistan', 'Thailand', 'Turkmenistan', 'United Arab Emirates', 'Uzbekistan', 'Vietnam', 'Yemen',
  'Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'England', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Scotland', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'Wales',
  'Australia', 'Fiji', 'New Zealand', 'Papua New Guinea', 'Solomon Islands', 'Vanuatu',
];

const COMPETITION_CATEGORIES = [
  { labelKey: 'competitions.internationalNational', keywords: ['World Cup', 'Euro', 'Copa', 'AFCON', 'CAN', 'Asian Cup', 'Gold Cup'] },
  { labelKey: 'competitions.internationalClub', keywords: ['Champions League', 'Europa League', 'Conference League', 'Club World Cup'] },
  { labelKey: 'competitions.topDomestic', keywords: ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1'] },
  { labelKey: 'competitions.otherDomestic', keywords: ['Saudi Pro League', 'MLS'] },
  { labelKey: 'competitions.maghreb', keywords: ['Botola', 'Algerian', 'Tunisian', 'Morocco', 'Maroc'] },
];

export function AdvancedFilters({ matches, filters, onFiltersChange, isOpen, onClose, filteredMatchesCount }) {
  const { t, language } = useTranslation();
  const [competitionSearch, setCompetitionSearch] = useState('');
  const [countrySearch, setCountrySearch] = useState('');

  const filterOptions = useMemo(() => {
    const allCompetitions = [...new Set(matches.map(m => m.leagueEn || m.league))].sort();
    const categorized = {};
    const uncategorized = [];
    allCompetitions.forEach(comp => {
      const compLower = comp.toLowerCase();
      let found = false;
      for (const cat of COMPETITION_CATEGORIES) {
        if (cat.keywords.some(kw => compLower.includes(kw.toLowerCase()))) {
          if (!categorized[cat.labelKey]) categorized[cat.labelKey] = [];
          categorized[cat.labelKey].push(comp);
          found = true;
          break;
        }
      }
      if (!found) uncategorized.push(comp);
    });
    const countries = ALL_COUNTRIES.map(c => (c === 'Morocco' ? 'Maroc' : c === 'USA' ? 'United States' : c)).sort();
    const statuses = ['finished', 'live', 'notStarted'];
    return { categorized, uncategorized, countries, statuses };
  }, [matches]);

  const handleFilterToggle = (filterType, value) => {
    const current = filters[filterType] || [];
    const newValues = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    onFiltersChange({ ...filters, [filterType]: newValues.length > 0 ? newValues : [] });
  };
  const clearFilter = (filterType) => onFiltersChange({ ...filters, [filterType]: [] });
  const clearAllFilters = () => onFiltersChange({ competition: [], country: [], status: [] });
  const activeFiltersCount = Object.values(filters).reduce((s, arr) => s + (Array.isArray(arr) ? arr.length : arr ? 1 : 0), 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('filters-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('filters-open');
    }
    return () => { document.body.style.overflow = ''; document.body.classList.remove('filters-open'); };
  }, [isOpen]);

  if (!isOpen) return null;

  const statusLabels = { finished: language === 'ar' ? 'انتهت' : 'Terminé', live: language === 'ar' ? 'مباشر' : 'En direct', notStarted: language === 'ar' ? 'لم تبدأ' : 'À venir' };
  const africanCountries = ['Algeria', 'Maroc', 'Morocco', 'Tunisia', 'Egypt', 'Nigeria', 'Ghana', 'Senegal', 'Cameroon', 'South Africa', 'Kenya', 'Ethiopia', 'Tanzania', 'Uganda', 'Angola', 'Mozambique', 'Madagascar', 'Mali', 'Burkina Faso', 'Niger', 'Malawi', 'Zambia', 'Zimbabwe', 'Benin', 'Guinea', 'Rwanda', 'Burundi', 'Chad', 'Somalia', 'Mauritania', 'Sierra Leone', 'Togo', 'Eritrea', 'Gambia', 'Botswana', 'Gabon', 'Lesotho', 'Guinea-Bissau', 'Equatorial Guinea', 'Mauritius', 'Eswatini', 'Djibouti', 'Comoros', 'Cape Verde', 'Libya', 'Sudan', 'South Sudan'];
  const europeanCountries = ['France', 'Germany', 'Spain', 'Italy', 'England', 'Netherlands', 'Portugal', 'Belgium', 'Greece', 'Turkey', 'Poland', 'Austria', 'Switzerland', 'Denmark', 'Sweden', 'Norway', 'Finland', 'Ireland', 'Czech Republic', 'Romania', 'Hungary', 'Croatia', 'Serbia', 'Slovakia', 'Bulgaria', 'Ukraine', 'Russia', 'Scotland', 'Wales', 'Iceland', 'Cyprus', 'Slovenia', 'Estonia', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Albania', 'Bosnia', 'Macedonia', 'Montenegro', 'Kosovo', 'Moldova', 'Georgia', 'Armenia', 'Azerbaijan', 'Belarus', 'Andorra', 'Liechtenstein', 'Monaco', 'San Marino'];
  const asianCountries = ['China', 'Japan', 'India', 'Saudi Arabia', 'Iran', 'South Korea', 'Qatar', 'UAE', 'United Arab Emirates', 'Iraq', 'Jordan', 'Kuwait', 'Oman', 'Bahrain', 'Lebanon', 'Syria', 'Yemen', 'Palestine', 'Afghanistan', 'Pakistan', 'Bangladesh', 'Thailand', 'Vietnam', 'Malaysia', 'Singapore', 'Indonesia', 'Philippines', 'Myanmar', 'Cambodia', 'Laos', 'Mongolia', 'North Korea', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Israel', 'Sri Lanka', 'Nepal', 'Bhutan', 'Maldives'];
  const americanCountries = ['United States', 'USA', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Uruguay', 'Paraguay', 'Ecuador', 'Venezuela', 'Bolivia', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panama', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic', 'Trinidad', 'Barbados'];
  const oceaniaCountries = ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Solomon Islands', 'Vanuatu'];
  const inRegion = (country, list) => list.some(r => country === r || country.includes(r) || (typeof r === 'string' && r.includes(country)));
  const filterBySearch = (list, search) => !search.trim() || list.some(c => String(c).toLowerCase().includes(search.toLowerCase()));
  const filterCountries = (list, search) => list.filter(c => !countrySearch.trim() || String(c).toLowerCase().includes(countrySearch.toLowerCase()));

  return (
    <>
      <div className="filters-overlay" onClick={onClose} />
      <div className="advanced-filters-sidebar">
        <div className="filters-header">
          <div className="filters-title-section">
            <h3 className="filters-title">{language === 'ar' ? '🔍 الفلاتر' : '🔍 Filters'}</h3>
            {activeFiltersCount > 0 && <span className="active-filters-badge">{activeFiltersCount}</span>}
          </div>
          <button className="close-filters-btn" onClick={onClose}>×</button>
        </div>
        <div className="filters-content">
          <div className="filter-section">
            <div className="filter-section-header">
              <label className="filter-label">{language === 'ar' ? '🏆 البطولات' : '🏆 Compétitions'}</label>
              {filters.competition?.length > 0 && <button className="clear-filter-btn" onClick={() => clearFilter('competition')}>✕</button>}
            </div>
            <input type="text" className="filter-search-input" placeholder={language === 'ar' ? '🔍 ابحث عن بطولة...' : '🔍 Search competition...'} value={competitionSearch} onChange={(e) => setCompetitionSearch(e.target.value)} />
            <select className="filter-select" multiple value={filters.competition || []} onChange={(e) => onFiltersChange({ ...filters, competition: Array.from(e.target.selectedOptions, o => o.value) })} size={10}>
              {Object.keys(filterOptions.categorized).filter(k => filterBySearch(filterOptions.categorized[k], competitionSearch)).map(k => (
                <optgroup key={k} label={t(k)}>
                  {filterOptions.categorized[k].filter(c => !competitionSearch.trim() || c.toLowerCase().includes(competitionSearch.toLowerCase())).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
              ))}
              {filterOptions.uncategorized.length > 0 && filterBySearch(filterOptions.uncategorized, competitionSearch) && (
                <optgroup label={language === 'ar' ? '📋 أخرى' : '📋 Others'}>
                  {filterOptions.uncategorized.filter(c => !competitionSearch.trim() || c.toLowerCase().includes(competitionSearch.toLowerCase())).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </optgroup>
              )}
            </select>
            {filters.competition?.length > 0 && <div className="selected-count">{filters.competition.length} {language === 'ar' ? 'محدد' : 'selected'}</div>}
          </div>
          <div className="filter-section">
            <div className="filter-section-header">
              <label className="filter-label">{language === 'ar' ? '📊 الحالة' : '📊 Statut'}</label>
              {filters.status?.length > 0 && <button className="clear-filter-btn" onClick={() => clearFilter('status')}>✕</button>}
            </div>
            <div className="filter-chips">
              {filterOptions.statuses.map(status => (
                <button key={status} className={`filter-chip status-chip ${status} ${filters.status?.includes(status) ? 'active' : ''}`} onClick={() => handleFilterToggle('status', status)}>
                  {statusLabels[status]}{filters.status?.includes(status) && <span className="chip-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <div className="filter-section-header">
              <label className="filter-label">{language === 'ar' ? '🌍 البلدان' : '🌍 Pays'}</label>
              {filters.country?.length > 0 && <button className="clear-filter-btn" onClick={() => clearFilter('country')}>✕</button>}
            </div>
            <input type="text" className="filter-search-input" placeholder={language === 'ar' ? '🔍 ابحث عن بلد...' : '🔍 Search country...'} value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} />
            <select className="filter-select filter-select-countries" multiple value={filters.country || []} onChange={(e) => onFiltersChange({ ...filters, country: Array.from(e.target.selectedOptions, o => o.value) })} size={5}>
              <optgroup label={language === 'ar' ? '🌍 أفريقيا' : '🌍 Africa'}>
                {filterCountries(filterOptions.countries.filter(c => inRegion(c, africanCountries)), countrySearch).map(c => <option key={c} value={c}>{c}</option>)}
              </optgroup>
              <optgroup label={language === 'ar' ? '🌍 أوروبا' : '🌍 Europe'}>
                {filterCountries(filterOptions.countries.filter(c => inRegion(c, europeanCountries)), countrySearch).map(c => <option key={c} value={c}>{c}</option>)}
              </optgroup>
              <optgroup label={language === 'ar' ? '🌍 آسيا' : '🌍 Asia'}>
                {filterCountries(filterOptions.countries.filter(c => inRegion(c, asianCountries)), countrySearch).map(c => <option key={c} value={c}>{c}</option>)}
              </optgroup>
              <optgroup label={language === 'ar' ? '🌍 الأمريكتان' : '🌍 Americas'}>
                {filterCountries(filterOptions.countries.filter(c => inRegion(c, americanCountries)), countrySearch).map(c => <option key={c} value={c}>{c}</option>)}
              </optgroup>
              <optgroup label={language === 'ar' ? '🌍 أوقيانوسيا' : '🌍 Oceania'}>
                {filterCountries(filterOptions.countries.filter(c => inRegion(c, oceaniaCountries)), countrySearch).map(c => <option key={c} value={c}>{c}</option>)}
              </optgroup>
            </select>
            {filters.country?.length > 0 && <div className="selected-count">{filters.country.length} {language === 'ar' ? 'محدد' : 'selected'} / {filterOptions.countries.length}</div>}
          </div>
        </div>
        <div className="filters-footer">
          <button className="view-results-btn" onClick={onClose}>{language === 'ar' ? `عرض ${filteredMatchesCount ?? matches.length} مباراة` : `View ${filteredMatchesCount ?? matches.length} matches`}</button>
          {activeFiltersCount > 0 && <button className="clear-all-btn-footer" onClick={clearAllFilters}>{language === 'ar' ? 'مسح الكل' : 'Clear all'}</button>}
        </div>
      </div>
    </>
  );
}

export function FiltersButton({ onClick, activeFiltersCount }) {
  const { language } = useTranslation();
  return (
    <button className="open-filters-btn" onClick={onClick}>
      {language === 'ar' ? '🔍 الفلاتر' : '🔍 Filters'}
      {activeFiltersCount > 0 && <span className="filters-count-badge">{activeFiltersCount}</span>}
    </button>
  );
}
