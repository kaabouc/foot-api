import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import Header from './components/Header';
import FilterButtons from './components/FilterButtons';
import MatchList from './components/MatchList';
import AdvancedFilters, { FiltersButton } from './components/AdvancedFilters';
import Pagination from './components/Pagination';
import { fetchTodayMatches, fetchYesterdayMatches, fetchTomorrowMatches } from './services/apiService';
import { useTranslation } from './contexts/LanguageContext';
import {
  getMatchesWithCache,
  startCacheAutoUpdate,
  getAllDates,
  getServerTimezone
} from './services/cacheService';

// Liste de toutes les compétitions autorisées (doit correspondre à COMPETITION_CATEGORIES dans SearchAndFilter.js)
const ALLOWED_COMPETITIONS = [
  'FIFA World Cup', 'World Cup', 'World Cup Qualifiers',
  'UEFA European Championship', 'European Championship', 'UEFA Euro', 'Euro', 'EURO',
  'Copa América', 'Copa America',
  'Africa Cup of Nations', 'AFCON', 'CAN', 'African Cup of Nations',
  'AFC Asian Cup', 'Asian Cup',
  'CONCACAF Gold Cup', 'Gold Cup',
  'UEFA Champions League', 'Champions League', 'UCL',
  'UEFA Europa League', 'Europa League', 'UEL',
  'UEFA Conference League', 'Conference League', 'UECL',
  'FIFA Club World Cup', 'Club World Cup',
  'Premier League', 'English Premier League', 'EPL',
  'La Liga', 'Primera División', 'Spanish La Liga', 'Spain La Liga',
  'Serie A', 'Italian Serie A', 'Serie A TIM', 'Italy Serie A',
  'Bundesliga', 'German Bundesliga', '1. Bundesliga', 'Germany Bundesliga',
  'Ligue 1', 'French Ligue 1', 'Ligue 1 Uber Eats', 'France Ligue 1',
  'Saudi Pro League', 'Saudi Professional League', 'Roshn Saudi League',
  'MLS', 'Major League Soccer',
  'Botola Pro', 'Botola', 'Moroccan Botola', 'Botola 1', 'Morocco Botola Pro', 'Morocco', 'Moroccan League',
  'Algerian Ligue 1', 'Ligue Professionnelle 1', 'Algeria Ligue 1', 'Algeria', 'Algerian League', 'Ligue 1 Algérie', 'Ligue 1 Algeria',
  'Tunisian Ligue 1', 'Tunisia Ligue 1', 'Tunisian League', 'Tunisia', 'Ligue 1 Pro Tunisia', 'Ligue 1 Tunisie', 'Ligue 1 Tunisia',
];

// Fonction pour vérifier si une compétition est dans notre liste autorisée
const isAllowedCompetition = (leagueName) => {
  if (!leagueName) return false;
  const leagueLower = leagueName.toLowerCase();
  return ALLOWED_COMPETITIONS.some(allowed => 
    leagueLower === allowed.toLowerCase() ||
    leagueLower.includes(allowed.toLowerCase()) ||
    allowed.toLowerCase().includes(leagueLower)
  );
};

function App() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('today');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    competition: [],
    country: [],
    status: []
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const matchesPerPage = 20;
  
  // Variables pour le cache et le timezone
  const [serverTimezone, setServerTimezone] = useState(null);
  const [cacheDates, setCacheDates] = useState(null);

  // Initialiser le système de cache au montage du composant
  useEffect(() => {
    // Obtenir le timezone et les dates
    const timezone = getServerTimezone();
    const dates = getAllDates();
    
    setServerTimezone(timezone);
    setCacheDates(dates);
    
    console.log('🌍 Server Timezone:', timezone);
    console.log('📅 Cache Dates:', dates);
    
    // Démarrer le système de mise à jour automatique du cache
    const intervalId = startCacheAutoUpdate(
      fetchYesterdayMatches,
      fetchTodayMatches,
      fetchTomorrowMatches
    );
    
    // Nettoyer l'intervalle au démontage
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    if (cacheDates) return cacheDates.today;
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get yesterday's date
  const getYesterdayDate = () => {
    if (cacheDates) return cacheDates.yesterday;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  // Get tomorrow's date
  const getTomorrowDate = () => {
    if (cacheDates) return cacheDates.tomorrow;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Fonction pour charger les matchs depuis le cache ou l'API
  const loadMatches = async (filter) => {
    setLoading(true);
    setError(null);

    try {
      let fetchedMatches = [];
      let date = '';

      // Utiliser le cache pour optimiser les requêtes API
      try {
          switch (filter) {
            case 'yesterday':
              date = getYesterdayDate();
              fetchedMatches = await getMatchesWithCache(date, fetchYesterdayMatches);
              break;
            case 'tomorrow':
              date = getTomorrowDate();
              fetchedMatches = await getMatchesWithCache(date, fetchTomorrowMatches);
              break;
            case 'today':
            default:
              date = getTodayDate();
              fetchedMatches = await getMatchesWithCache(date, fetchTodayMatches);
              break;
          }
          
          console.log('📊 ========== API RESPONSE SUMMARY ==========');
          console.log('📊 Matches fetched from API:', fetchedMatches.length);
          console.log('📊 Matches type:', Array.isArray(fetchedMatches) ? 'Array' : typeof fetchedMatches);
          console.log('📋 Fetched matches data:', fetchedMatches);
          
          if (fetchedMatches.length > 0) {
            console.log('📋 First match:', JSON.stringify(fetchedMatches[0], null, 2));
            console.log('📋 First match keys:', Object.keys(fetchedMatches[0] || {}));
            console.log('📋 First match has team1?', !!fetchedMatches[0]?.team1);
            console.log('📋 First match has team2?', !!fetchedMatches[0]?.team2);
          }
          console.log('📊 ===========================================');
          
          // Si aucun match retourné depuis l'API, c'est normal - pas de fallback sur données mockées
          // L'application utilise uniquement des données réelles de l'API
          if (fetchedMatches.length === 0) {
            console.log('ℹ️ No matches returned from API for this date');
            console.log('💡 This is normal - there may be no matches scheduled for this date');
            setError(null); // Pas d'erreur, juste aucun match disponible
          } else {
            console.log(`✅ SUCCESS! Got ${fetchedMatches.length} match(es) from API`);
            console.log('📋 Sample match structure:', JSON.stringify(fetchedMatches[0], null, 2));
            // Succès avec des matchs - nettoyer l'erreur précédente
            setError(null);
          }
        } catch (apiError) {
          console.error('API error details:', apiError);
          console.error('API error message:', apiError.message);
          
          // En cas d'erreur API, ne pas utiliser de données mockées - afficher seulement l'erreur
          fetchedMatches = [];
          
          // Afficher un message d'erreur spécifique
          if (apiError.message && apiError.message.includes('API key')) {
            setError('⚠️ Clé API non configurée. Vérifiez votre fichier .env et redémarrez le serveur.');
          } else if (apiError.message && apiError.message.includes('Proxy server not running')) {
            setError('⚠️ Serveur proxy non démarré. Lancez "npm run proxy" dans un terminal séparé.');
          } else if (apiError.message) {
            setError(`⚠️ Erreur API: ${apiError.message}`);
          } else {
            setError('⚠️ Erreur lors de la récupération des données API. Vérifiez votre connexion internet et vos clés API.');
          }
        }

      console.log('📤 Setting matches state with', fetchedMatches.length, 'match(es)');
      console.log('📤 Matches being set:', fetchedMatches);
      setMatches(fetchedMatches);
      
      // Vérifier après un court délai que les matchs sont bien dans le state
      setTimeout(() => {
        console.log('🔍 State check - matches should be set now');
      }, 100);
    } catch (err) {
      console.error('❌ Error loading matches:', err);
      console.error('❌ Error stack:', err.stack);
      setError(t('errors.loading'));
      
      // En cas d'erreur, ne pas utiliser de données mockées
      console.log('❌ Error loading matches - no fallback data available');
      setMatches([]);
    } finally {
      setLoading(false);
      console.log('✅ Loading finished');
    }
  };

  // Charger les matchs quand le filtre change
  useEffect(() => {
    loadMatches(activeFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    // Réinitialiser les filtres quand on change de date
    setFilters({
      competition: [],
      country: [],
      status: []
    });
    setCurrentPage(1); // Réinitialiser à la page 1
  };

  // Filtrer les matchs selon tous les critères
  const filteredMatches = useMemo(() => {
    let filtered = matches;

    // TOUJOURS filtrer pour ne montrer que les compétitions autorisées
    filtered = filtered.filter(match => {
      const leagueName = match.leagueEn || match.league;
      return isAllowedCompetition(leagueName);
    });

    // Filtrer par compétitions (sélection multiple)
    if (filters.competition && filters.competition.length > 0) {
      filtered = filtered.filter(match => 
        filters.competition.includes(match.leagueEn || match.league)
      );
    }

    // Filtrer par pays (sélection multiple)
    if (filters.country && filters.country.length > 0) {
      console.log('🔍 Filtering by country:', filters.country);
      const beforeCount = filtered.length;
      
      // Fonction de normalisation (identique à celle dans apiService.js)
      const normalizeCountry = (country) => {
        if (!country) return null;
        
        // Remplacer les tirets par des espaces
        let normalized = country.replace(/-/g, ' ').trim();
        
        const countryMap = {
          'Morocco': 'Maroc',
          'USA': 'United States',
          'United States': 'United States',
          'UAE': 'United Arab Emirates',
          'United Arab Emirates': 'United Arab Emirates',
          'Ivory Coast': 'Côte d\'Ivoire',
          'Côte d\'Ivoire': 'Côte d\'Ivoire',
          'Cote d\'Ivoire': 'Côte d\'Ivoire',
          'Congo DR': 'Congo DR',
          'Congo-DR': 'Congo DR',
          'Congo D R': 'Congo DR',
          'Trinidad And Tobago': 'Trinidad and Tobago',
          'Trinidad-And-Tobago': 'Trinidad and Tobago',
          'Costa Rica': 'Costa Rica',
          'Costa-Rica': 'Costa Rica',
          'Saudi Arabia': 'Saudi Arabia',
          'Saudi-Arabia': 'Saudi Arabia',
          'Hong Kong': 'Hong Kong',
          'Hong-Kong': 'Hong Kong',
        };
        
        // Vérifier dans la map avec le nom original et normalisé
        if (countryMap[country]) {
          return countryMap[country];
        }
        if (countryMap[normalized]) {
          return countryMap[normalized];
        }
        
        // Retourner la version normalisée (sans tirets)
        return normalized;
      };
      
      filtered = filtered.filter(match => {
        if (!match.country) {
          console.log(`⚠️ Match has no country: ${match.team1.name} vs ${match.team2.name}`);
          return false;
        }
        
        // Normaliser le pays du match (remplacer tirets par espaces, etc.)
        const normalizedMatchCountry = normalizeCountry(match.country);
        
        // Normaliser aussi les pays dans les filtres pour la comparaison
        const normalizedFilters = filters.country.map(fc => normalizeCountry(fc));
        
        // Comparaison insensible à la casse et aux variations
        const matchCountryLower = normalizedMatchCountry?.toLowerCase() || '';
        const originalMatchCountryLower = match.country?.toLowerCase() || '';
        
        const matchesFilter = normalizedFilters.some(nf => {
          const nfLower = nf?.toLowerCase() || '';
          return nfLower === matchCountryLower || 
                 nfLower === originalMatchCountryLower ||
                 matchCountryLower.includes(nfLower) ||
                 nfLower.includes(matchCountryLower);
        }) || filters.country.some(fc => {
          const fcLower = fc?.toLowerCase() || '';
          return fcLower === matchCountryLower || 
                 fcLower === originalMatchCountryLower ||
                 matchCountryLower.includes(fcLower) ||
                 fcLower.includes(matchCountryLower);
        });
        
        if (matchesFilter) {
          console.log(`✅ Match country "${match.country}" (normalized: "${normalizedMatchCountry}") matches filter`);
        } else {
          console.log(`❌ Match country "${match.country}" (normalized: "${normalizedMatchCountry}") does NOT match filter`);
        }
        
        return matchesFilter;
      });
      
      console.log(`📊 Country filter: ${beforeCount} → ${filtered.length} matches`);
    }

    // Filtrer par statut (sélection multiple)
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(match => 
        filters.status.includes(match.status)
      );
    }


    return filtered;
  }, [matches, filters]);

  // Calculer la pagination
  const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);
  
  // Réinitialiser à la page 1 si la page actuelle est invalide ou si les filtres changent
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Réinitialiser à la page 1 quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Obtenir les matchs de la page actuelle
  const paginatedMatches = useMemo(() => {
    const startIndex = (currentPage - 1) * matchesPerPage;
    const endIndex = startIndex + matchesPerPage;
    return filteredMatches.slice(startIndex, endIndex);
  }, [filteredMatches, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll vers le haut de la liste des matchs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="App">
      <Header serverTimezone={serverTimezone} />
      <main className="main-content">
        <div className="container">
          <FilterButtons 
            activeFilter={activeFilter} 
            onFilterChange={handleFilterChange} 
          />

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>{t('matches.loading')}</p>
            </div>
          ) : (
            <>
              {matches.length > 0 && (
                <>
                  <FiltersButton 
                    onClick={() => setIsFiltersOpen(true)}
                    activeFiltersCount={Object.values(filters).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0)}
                  />
                  <AdvancedFilters
                    matches={matches}
                    filters={filters}
                    onFiltersChange={setFilters}
                    isOpen={isFiltersOpen}
                    onClose={() => setIsFiltersOpen(false)}
                    filteredMatchesCount={filteredMatches.length}
                  />
                </>
              )}
              
              <div className="matches-section">
                <div className="section-header">
                  <h2 className="section-title">{t('matches.title')}</h2>
                  <div className="matches-info">
                    {filteredMatches.length !== matches.length && (
                      <span className="matches-count">
                        ({filteredMatches.length} {t('matches.from')} {matches.length})
                      </span>
                    )}
                    {totalPages > 1 && (
                      <span className="pagination-info">
                        {t('matches.page')} {currentPage} {t('matches.of')} {totalPages}
                      </span>
                    )}
                  </div>
                </div>
                {console.log('🎯 App rendering MatchList with:', { 
                  matchesCount: paginatedMatches?.length, 
                  totalMatches: matches?.length,
                  filteredMatches: filteredMatches?.length,
                  currentPage: currentPage,
                  totalPages: totalPages,
                  error 
                })}
                <MatchList matches={paginatedMatches || []} isFromAPI={true} />
                
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
