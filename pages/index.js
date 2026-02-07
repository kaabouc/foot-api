import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../src/components/Header';
import FilterButtons from '../src/components/FilterButtons';
import MatchList from '../src/components/MatchList';
import AdvancedFilters, { FiltersButton } from '../src/components/AdvancedFilters';
import Pagination from '../src/components/Pagination';
import { fetchTodayMatches, fetchYesterdayMatches, fetchTomorrowMatches } from '../src/services/apiService';
import { getMatchesWithCache, startCacheAutoUpdate, getAllDates, getServerTimezone } from '../src/services/cacheService';
import { useTranslation } from '../src/contexts/LanguageContext';
import { isAllowedCompetition } from '../src/constants/competitions';
import { SITE_URL, SEO_KEYWORDS } from '../src/constants/seo';

const MATCHES_PER_PAGE = 20;

function filterMatchesByAllowed(matches) {
  return (matches || []).filter((match) => {
    const leagueName = match.leagueEn || match.league;
    return isAllowedCompetition(leagueName);
  });
}

export async function getServerSideProps(context) {
  const { filter = 'today', lang = 'ar' } = context.query;
  const validFilter = ['today', 'yesterday', 'tomorrow'].includes(filter) ? filter : 'today';

  let initialMatches = [];
  try {
    if (validFilter === 'yesterday') {
      initialMatches = await fetchYesterdayMatches();
    } else if (validFilter === 'tomorrow') {
      initialMatches = await fetchTomorrowMatches();
    } else {
      initialMatches = await fetchTodayMatches();
    }
  } catch (e) {
    console.error('SSR fetch matches error:', e);
  }

  const filtered = filterMatchesByAllowed(initialMatches);

  return {
    props: {
      initialMatches: filtered,
      filter: validFilter,
      initialLang: ['ar', 'fr'].includes(lang) ? lang : 'ar',
    },
  };
}

export default function Home({ initialMatches, filter, initialLang }) {
  const router = useRouter();
  const { t, language } = useTranslation();
  const [activeFilter, setActiveFilter] = useState(filter);
  const [matches, setMatches] = useState(initialMatches);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ competition: [], country: [], status: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [serverTimezone, setServerTimezone] = useState(null);
  const [cacheDates, setCacheDates] = useState(null);

  useEffect(() => {
    setServerTimezone(getServerTimezone());
    setCacheDates(getAllDates());
    const intervalId = startCacheAutoUpdate(fetchYesterdayMatches, fetchTodayMatches, fetchTomorrowMatches);
    return () => intervalId && clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setActiveFilter(filter);
    setMatches(initialMatches);
  }, [filter, initialMatches]);

  const loadMatches = async (filterKey) => {
    setLoading(true);
    setError(null);
    try {
      let fetched = [];
      switch (filterKey) {
        case 'yesterday':
          fetched = await getMatchesWithCache(cacheDates?.yesterday || new Date(Date.now() - 864e5).toISOString().split('T')[0], fetchYesterdayMatches);
          break;
        case 'tomorrow':
          fetched = await getMatchesWithCache(cacheDates?.tomorrow || new Date(Date.now() + 864e5).toISOString().split('T')[0], fetchTomorrowMatches);
          break;
        default:
          fetched = await getMatchesWithCache(cacheDates?.today || new Date().toISOString().split('T')[0], fetchTodayMatches);
      }
      setMatches(filterMatchesByAllowed(fetched));
    } catch (apiError) {
      setError(apiError.message || t('errors.loading'));
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterKey) => {
    setActiveFilter(filterKey);
    setFilters({ competition: [], country: [], status: [] });
    setCurrentPage(1);
    const params = new URLSearchParams(router.query);
    params.set('filter', filterKey);
    router.push(`${router.pathname}?${params.toString()}`, undefined, { shallow: true });
    loadMatches(filterKey);
  };

  const filteredMatches = useMemo(() => {
    let result = matches.filter((match) => isAllowedCompetition(match.leagueEn || match.league));
    if (filters.competition?.length) {
      result = result.filter((m) => filters.competition.includes(m.leagueEn || m.league));
    }
    if (filters.country?.length) {
      const norm = (c) => (c === 'Morocco' ? 'Maroc' : c === 'USA' ? 'United States' : c);
      result = result.filter((m) => m.country && filters.country.some((fc) => norm(m.country) === norm(fc) || m.country === fc));
    }
    if (filters.status?.length) {
      result = result.filter((m) => filters.status.includes(m.status));
    }
    return result;
  }, [matches, filters]);

  const totalPages = Math.ceil(filteredMatches.length / MATCHES_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(1);
  }, [totalPages, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const paginatedMatches = useMemo(() => {
    const start = (currentPage - 1) * MATCHES_PER_PAGE;
    return filteredMatches.slice(start, start + MATCHES_PER_PAGE);
  }, [filteredMatches, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const baseTitle = language === 'ar' ? 'كورة للعالم - Koora for the World' : 'Koora for the World - كورة للعالم';
  const getSEOTitle = () => {
    switch (activeFilter) {
      case 'yesterday':
        return language === 'ar' ? `${baseTitle} | مباريات أمس | نتائج المباريات` : `${baseTitle} | Matchs d'hier | Résultats`;
      case 'tomorrow':
        return language === 'ar' ? `${baseTitle} | مباريات غداً | المباريات القادمة` : `${baseTitle} | Matchs de demain | Prochains matchs`;
      default:
        return language === 'ar' ? `${baseTitle} | مباريات اليوم | نتائج مباشرة` : `${baseTitle} | Matchs d'aujourd'hui | Résultats en direct`;
    }
  };
  const getSEODescription = () => {
    const base = language === 'ar'
      ? 'شاهد مباريات اليوم، نتائج المباريات، وأخبار كرة القدم من المغرب والعالم. متابعة مباشرة لجميع البطولات.'
      : 'Live football scores and today\'s matches from Morocco and the world. Premier League, La Liga, Champions League, Botola.';
    switch (activeFilter) {
      case 'yesterday':
        return language === 'ar' ? 'نتائج مباريات أمس - كورة للعالم | جميع نتائج المباريات والبطولات' : 'Résultats des matchs d\'hier - Koora for the World | Tous les résultats.';
      case 'tomorrow':
        return language === 'ar' ? 'مباريات غداً - كورة للعالم | المباريات القادمة والمواعيد' : 'Matchs de demain - Koora for the World | Prochains matchs.';
      default:
        return base;
    }
  };
  const canonicalUrl = `${SITE_URL}/?filter=${activeFilter}&lang=${language}`;

  return (
    <>
      <Head>
        <title>{getSEOTitle()}</title>
        <meta name="description" content={getSEODescription()} />
        <meta name="keywords" content={SEO_KEYWORDS} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={getSEOTitle()} />
        <meta property="og:description" content={getSEODescription()} />
        <meta property="og:image" content={`${SITE_URL}/og-image.jpg`} />
        <meta name="twitter:title" content={getSEOTitle()} />
        <meta name="twitter:description" content={getSEODescription()} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.jpg`} />
      </Head>
      <div className="App">
        <Header serverTimezone={serverTimezone} />
        <main className="main-content">
          <div className="container">
            <FilterButtons activeFilter={activeFilter} onFilterChange={handleFilterChange} />

            {error && <div className="error-message">⚠️ {error}</div>}

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner" />
                <p>{t('matches.loading')}</p>
              </div>
            ) : (
              <>
                {matches.length > 0 && (
                  <>
                    <FiltersButton
                      onClick={() => setIsFiltersOpen(true)}
                      activeFiltersCount={Object.values(filters).reduce((s, arr) => s + (Array.isArray(arr) ? arr.length : 0), 0)}
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
                  <MatchList matches={paginatedMatches || []} isFromAPI />
                  {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
