import React, { useMemo } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

// Organisation des compétitions par catégories
const COMPETITION_CATEGORIES = [
  {
    labelKey: 'competitions.internationalNational',
    competitions: [
      { name: 'FIFA World Cup', aliases: ['FIFA World Cup', 'World Cup', 'World Cup Qualifiers'] },
      { name: 'UEFA European Championship', aliases: ['UEFA European Championship', 'European Championship', 'UEFA Euro', 'Euro', 'EURO'] },
      { name: 'Copa América', aliases: ['Copa América', 'Copa America'] },
      { name: 'Africa Cup of Nations', aliases: ['Africa Cup of Nations', 'AFCON', 'CAN', 'African Cup of Nations'] },
      { name: 'AFC Asian Cup', aliases: ['AFC Asian Cup', 'Asian Cup'] },
      { name: 'CONCACAF Gold Cup', aliases: ['CONCACAF Gold Cup', 'Gold Cup'] },
    ]
  },
  {
    labelKey: 'competitions.internationalClub',
    competitions: [
      { name: 'UEFA Champions League', aliases: ['UEFA Champions League', 'Champions League', 'UCL'] },
      { name: 'UEFA Europa League', aliases: ['UEFA Europa League', 'Europa League', 'UEL'] },
      { name: 'UEFA Conference League', aliases: ['UEFA Conference League', 'Conference League', 'UECL'] },
      { name: 'FIFA Club World Cup', aliases: ['FIFA Club World Cup', 'Club World Cup'] },
    ]
  },
  {
    labelKey: 'competitions.topDomestic',
    competitions: [
      { name: 'Premier League', aliases: ['Premier League', 'English Premier League', 'EPL'] },
      { name: 'La Liga', aliases: ['La Liga', 'Primera División', 'Spanish La Liga', 'Spain La Liga'] },
      { name: 'Serie A', aliases: ['Serie A', 'Italian Serie A', 'Serie A TIM', 'Italy Serie A'] },
      { name: 'Bundesliga', aliases: ['Bundesliga', 'German Bundesliga', '1. Bundesliga', 'Germany Bundesliga'] },
      { name: 'Ligue 1', aliases: ['Ligue 1', 'French Ligue 1', 'Ligue 1 Uber Eats', 'France Ligue 1'] },
    ]
  },
  {
    labelKey: 'competitions.otherDomestic',
    competitions: [
      { name: 'Saudi Pro League', aliases: ['Saudi Pro League', 'Saudi Professional League', 'Roshn Saudi League'] },
      { name: 'MLS', aliases: ['MLS', 'Major League Soccer'] },
    ]
  },
  {
    labelKey: 'competitions.maghreb',
    competitions: [
      { name: 'Botola Pro', aliases: ['Botola Pro', 'Botola', 'Moroccan Botola', 'Botola 1', 'Morocco Botola Pro', 'الدوري المغربي', 'Morocco', 'Moroccan League'] },
      { name: 'Algerian Ligue 1', aliases: ['Algerian Ligue 1', 'Ligue Professionnelle 1', 'Algeria Ligue 1', 'الدوري الجزائري', 'Algeria', 'Algerian League', 'Ligue 1 Algérie', 'Ligue 1 Algeria'] },
      { name: 'Tunisian Ligue 1', aliases: ['Tunisian Ligue 1', 'Tunisia Ligue 1', 'Tunisian League', 'الدوري التونسي', 'Tunisia', 'Ligue 1 Pro Tunisia', 'Ligue 1 Tunisie', 'Ligue 1 Tunisia'] },
    ]
  },
];

const SearchAndFilter = ({ 
  matches, 
  selectedLeague, 
  onLeagueChange, 
  searchTerm, 
  onSearchChange 
}) => {
  const { t } = useTranslation();

  // Extraire toutes les compétitions uniques des matchs
  const allLeagues = useMemo(() => {
    return [...new Set(matches.map(match => match.leagueEn || match.league))].sort();
  }, [matches]);

  // Fonction pour trouver le nom exact d'une compétition dans les matchs
  const findExactLeagueName = (competition) => {
    const exactMatch = allLeagues.find(league => 
      competition.aliases.some(alias => {
        const leagueLower = league.toLowerCase();
        const aliasLower = alias.toLowerCase();
        return leagueLower === aliasLower || 
               leagueLower.includes(aliasLower) || 
               aliasLower.includes(leagueLower);
      })
    );
    return exactMatch || null;
  };

  // Organiser les compétitions par catégories avec seulement celles disponibles ET dans notre liste
  const organizedCompetitions = useMemo(() => {
    return COMPETITION_CATEGORIES.map(category => {
      const availableLeagues = category.competitions
        .map(competition => {
          // Trouver le nom exact dans les matchs
          const exactName = findExactLeagueName(competition);
          // Retourner le nom exact trouvé, ou null si pas trouvé
          return exactName;
        })
        .filter(league => league !== null); // Filtrer seulement celles qui existent dans les matchs
      
      return {
        label: t(category.labelKey),
        leagues: availableLeagues
      };
    }).filter(category => category.leagues.length > 0); // Afficher seulement les catégories qui ont au moins une compétition disponible
  }, [allLeagues, t]);

  return (
    <div className="search-filter-container">
      <div className="search-bar-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder={t('search.placeholder')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="filter-wrapper">
        <select
          className="league-select"
          value={selectedLeague}
          onChange={(e) => onLeagueChange(e.target.value)}
        >
          <option value="">{t('search.allLeagues')}</option>
          
          {organizedCompetitions.map((category, categoryIndex) => (
            <optgroup key={`category-${categoryIndex}`} label={category.label}>
              {category.leagues.map((league, leagueIndex) => (
                <option key={`${categoryIndex}-${leagueIndex}`} value={league}>
                  {league}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchAndFilter;

