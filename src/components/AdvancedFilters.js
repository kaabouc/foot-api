import React, { useState, useMemo, useEffect } from 'react';
import './AdvancedFilters.css';
import { useTranslation } from '../contexts/LanguageContext';

const AdvancedFilters = ({ 
  matches, 
  filters, 
  onFiltersChange,
  isOpen,
  onClose,
  filteredMatchesCount
}) => {
  const { t, language } = useTranslation();
  const [competitionSearch, setCompetitionSearch] = useState('');
  const [countrySearch, setCountrySearch] = useState('');

  // Liste complète de tous les pays
  const ALL_COUNTRIES = [
    // Afrique
    'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad',
    'Comoros', 'Congo', 'Congo DR', 'Côte d\'Ivoire', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia',
    'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar',
    'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda',
    'São Tomé and Príncipe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo',
    'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe',
    // Amérique du Nord et Centrale
    'USA', 'Canada', 'Mexico', 'Guatemala', 'Belize', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama',
    'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic', 'Trinidad and Tobago', 'Barbados', 'Bahamas', 'Antigua and Barbuda', 'Grenada', 'Saint Kitts and Nevis',
    // Amérique du Sud
    'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Guyana', 'Paraguay', 'Peru', 'Suriname',
    'Uruguay', 'Venezuela',
    // Asie
    'Afghanistan', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brunei', 'Cambodia', 'China', 'East Timor', 'India', 'Indonesia',
    'Iran', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Lebanon',
    'Malaysia', 'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'North Korea', 'Oman', 'Pakistan', 'Palestine', 'Philippines',
    'Qatar', 'Saudi Arabia', 'Singapore', 'South Korea', 'Sri Lanka', 'Syria', 'Tajikistan', 'Thailand', 'Turkmenistan', 'United Arab Emirates',
    'Uzbekistan', 'Vietnam', 'Yemen',
    // Europe
    'Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia',
    'Cyprus', 'Czech Republic', 'Denmark', 'England', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany', 'Greece',
    'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta',
    'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia',
    'San Marino', 'Scotland', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine',
    'Wales',
    // Océanie
    'Australia', 'Fiji', 'New Zealand', 'Papua New Guinea', 'Solomon Islands', 'Vanuatu',
  ];

  // Extraire toutes les options uniques avec organisation par catégories
  const filterOptions = useMemo(() => {
    const allCompetitions = [...new Set(matches.map(m => m.leagueEn || m.league))].sort();
    
    // Organiser les compétitions par catégories (comme dans SearchAndFilter)
    const COMPETITION_CATEGORIES = [
      {
        labelKey: 'competitions.internationalNational',
        keywords: ['World Cup', 'Euro', 'Copa', 'AFCON', 'CAN', 'Asian Cup', 'Gold Cup']
      },
      {
        labelKey: 'competitions.internationalClub',
        keywords: ['Champions League', 'Europa League', 'Conference League', 'Club World Cup']
      },
      {
        labelKey: 'competitions.topDomestic',
        keywords: ['Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1']
      },
      {
        labelKey: 'competitions.otherDomestic',
        keywords: ['Saudi Pro League', 'MLS']
      },
      {
        labelKey: 'competitions.maghreb',
        keywords: ['Botola', 'Algerian', 'Tunisian', 'Morocco', 'Maroc']
      }
    ];

    const categorized = {};
    const uncategorized = [];

    allCompetitions.forEach(comp => {
      const compLower = comp.toLowerCase();
      let categorized_flag = false;
      
      for (const category of COMPETITION_CATEGORIES) {
        if (category.keywords.some(keyword => compLower.includes(keyword.toLowerCase()))) {
          if (!categorized[category.labelKey]) {
            categorized[category.labelKey] = [];
          }
          categorized[category.labelKey].push(comp);
          categorized_flag = true;
          break;
        }
      }
      
      if (!categorized_flag) {
        uncategorized.push(comp);
      }
    });

    // Utiliser tous les pays disponibles, pas seulement ceux des matchs
    const countries = ALL_COUNTRIES.map(country => {
      // Normaliser certains noms
      if (country === 'Morocco') return 'Maroc';
      if (country === 'USA') return 'United States';
      // S'assurer que les noms avec espaces sont corrects
      return country;
    }).sort();
    
    const statuses = ['finished', 'live', 'notStarted'];

    return { categorized, uncategorized, countries, statuses };
  }, [matches, t]);

  const handleFilterToggle = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [filterType]: newValues.length > 0 ? newValues : []
    });
  };

  const clearFilter = (filterType) => {
    onFiltersChange({
      ...filters,
      [filterType]: []
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      competition: [],
      country: [],
      status: []
    });
  };

  const activeFiltersCount = Object.values(filters).reduce((sum, arr) => {
    return sum + (Array.isArray(arr) ? arr.length : (arr ? 1 : 0));
  }, 0);

  // Gérer l'opacité du body quand la sidebar est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('filters-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('filters-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('filters-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="filters-overlay" onClick={onClose}></div>
      <div className="advanced-filters-sidebar">
        <div className="filters-header">
          <div className="filters-title-section">
            <h3 className="filters-title">
              {language === 'ar' ? '🔍 الفلاتر' : '🔍 Filters'}
            </h3>
            {activeFiltersCount > 0 && (
              <span className="active-filters-badge">{activeFiltersCount}</span>
            )}
          </div>
          <button 
            className="close-filters-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="filters-content">
          {/* Filtre par compétition - Select avec groupes */}
          <div className="filter-section">
            <div className="filter-section-header">
              <label className="filter-label">
                {language === 'ar' ? '🏆 البطولات' : '🏆 Compétitions'}
              </label>
              {filters.competition?.length > 0 && (
                <button 
                  className="clear-filter-btn"
                  onClick={() => clearFilter('competition')}
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* Barre de recherche pour les compétitions */}
            <input
              type="text"
              className="filter-search-input"
              placeholder={language === 'ar' ? '🔍 ابحث عن بطولة...' : '🔍 Search competition...'}
              value={competitionSearch}
              onChange={(e) => setCompetitionSearch(e.target.value)}
            />
            
            <select
              className="filter-select"
              multiple
              value={filters.competition || []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                onFiltersChange({ ...filters, competition: selected });
              }}
              size={10}
            >
              {Object.keys(filterOptions.categorized)
                .filter(categoryKey => {
                  if (!competitionSearch.trim()) return true;
                  const searchLower = competitionSearch.toLowerCase();
                  return filterOptions.categorized[categoryKey].some(comp => 
                    comp.toLowerCase().includes(searchLower)
                  );
                })
                .map(categoryKey => (
                <optgroup key={categoryKey} label={t(categoryKey)}>
                  {filterOptions.categorized[categoryKey]
                    .filter(comp => !competitionSearch.trim() || 
                      comp.toLowerCase().includes(competitionSearch.toLowerCase()))
                    .map(comp => (
                    <option key={comp} value={comp}>
                      {comp}
                    </option>
                  ))}
                </optgroup>
              ))}
              {filterOptions.uncategorized.length > 0 && 
               (!competitionSearch.trim() || filterOptions.uncategorized.some(comp => 
                 comp.toLowerCase().includes(competitionSearch.toLowerCase()))) && (
                <optgroup label={language === 'ar' ? '📋 أخرى' : '📋 Others'}>
                  {filterOptions.uncategorized
                    .filter(comp => !competitionSearch.trim() || 
                      comp.toLowerCase().includes(competitionSearch.toLowerCase()))
                    .map(comp => (
                    <option key={comp} value={comp}>
                      {comp}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            {filters.competition?.length > 0 && (
              <div className="selected-count">
                {filters.competition.length} {language === 'ar' ? 'محدد' : 'selected'}
              </div>
            )}
          </div>

          {/* Filtre par statut */}
          <div className="filter-section">
            <div className="filter-section-header">
              <label className="filter-label">
                {language === 'ar' ? '📊 الحالة' : '📊 Statut'}
              </label>
              {filters.status?.length > 0 && (
                <button 
                  className="clear-filter-btn"
                  onClick={() => clearFilter('status')}
                >
                  ✕
                </button>
              )}
            </div>
            <div className="filter-chips">
              {filterOptions.statuses.map(status => {
                const statusLabels = {
                  finished: language === 'ar' ? 'انتهت' : 'Terminé',
                  live: language === 'ar' ? 'مباشر' : 'En direct',
                  notStarted: language === 'ar' ? 'لم تبدأ' : 'À venir'
                };
                return (
                  <button
                    key={status}
                    className={`filter-chip status-chip ${status} ${filters.status?.includes(status) ? 'active' : ''}`}
                    onClick={() => handleFilterToggle('status', status)}
                  >
                    {statusLabels[status]}
                    {filters.status?.includes(status) && <span className="chip-check">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtre par pays - Select multiple avec recherche et groupes */}
          <div className="filter-section">
            <div className="filter-section-header">
              <label className="filter-label">
                {language === 'ar' ? '🌍 البلدان' : '🌍 Pays'}
              </label>
              {filters.country?.length > 0 && (
                <button 
                  className="clear-filter-btn"
                  onClick={() => clearFilter('country')}
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* Barre de recherche pour les pays */}
            <input
              type="text"
              className="filter-search-input"
              placeholder={language === 'ar' ? '🔍 ابحث عن بلد...' : '🔍 Search country...'}
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
            />
            
            <select
              className="filter-select filter-select-countries"
              multiple
              value={filters.country || []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                console.log('🌍 Country filter changed:', selected);
                onFiltersChange({ ...filters, country: selected });
              }}
              size={5}
            >
              {/* Groupe Afrique */}
              <optgroup label={language === 'ar' ? '🌍 أفريقيا' : '🌍 Africa'}>
                {filterOptions.countries
                  .filter(country => {
                    const africanCountries = ['Algeria', 'Maroc', 'Morocco', 'Tunisia', 'Egypt', 'Nigeria', 'Ghana', 'Senegal', 'Cameroon', 'Ivory Coast', 'South Africa', 'Kenya', 'Ethiopia', 'Tanzania', 'Uganda', 'Angola', 'Mozambique', 'Madagascar', 'Mali', 'Burkina Faso', 'Niger', 'Malawi', 'Zambia', 'Zimbabwe', 'Benin', 'Guinea', 'Rwanda', 'Burundi', 'Chad', 'Somalia', 'Mauritania', 'Sierra Leone', 'Togo', 'Eritrea', 'Gambia', 'Botswana', 'Gabon', 'Lesotho', 'Guinea-Bissau', 'Equatorial Guinea', 'Mauritius', 'Eswatini', 'Djibouti', 'Comoros', 'Cape Verde', 'São Tomé', 'Seychelles', 'Libya', 'Sudan', 'South Sudan'];
                    return africanCountries.some(af => country === af || country.includes(af) || af.includes(country));
                  })
                  .filter(country => !countrySearch.trim() || 
                    country.toLowerCase().includes(countrySearch.toLowerCase()))
                  .map(country => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
              </optgroup>
              
              {/* Groupe Europe */}
              <optgroup label={language === 'ar' ? '🌍 أوروبا' : '🌍 Europe'}>
                {filterOptions.countries
                  .filter(country => {
                    const europeanCountries = ['France', 'Germany', 'Spain', 'Italy', 'England', 'Netherlands', 'Portugal', 'Belgium', 'Greece', 'Turkey', 'Poland', 'Austria', 'Switzerland', 'Denmark', 'Sweden', 'Norway', 'Finland', 'Ireland', 'Czech Republic', 'Romania', 'Hungary', 'Croatia', 'Serbia', 'Slovakia', 'Bulgaria', 'Ukraine', 'Russia', 'Scotland', 'Wales', 'Iceland', 'Cyprus', 'Slovenia', 'Estonia', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Albania', 'Bosnia', 'Macedonia', 'Montenegro', 'Kosovo', 'Moldova', 'Georgia', 'Armenia', 'Azerbaijan', 'Belarus', 'Andorra', 'Liechtenstein', 'Monaco', 'San Marino'];
                    return europeanCountries.some(eu => country === eu || country.includes(eu) || eu.includes(country));
                  })
                  .filter(country => !countrySearch.trim() || 
                    country.toLowerCase().includes(countrySearch.toLowerCase()))
                  .map(country => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
              </optgroup>
              
              {/* Groupe Asie */}
              <optgroup label={language === 'ar' ? '🌍 آسيا' : '🌍 Asia'}>
                {filterOptions.countries
                  .filter(country => {
                    const asianCountries = ['China', 'Japan', 'India', 'Saudi Arabia', 'Iran', 'South Korea', 'Qatar', 'UAE', 'United Arab Emirates', 'Iraq', 'Jordan', 'Kuwait', 'Oman', 'Bahrain', 'Lebanon', 'Syria', 'Yemen', 'Palestine', 'Afghanistan', 'Pakistan', 'Bangladesh', 'Thailand', 'Vietnam', 'Malaysia', 'Singapore', 'Indonesia', 'Philippines', 'Myanmar', 'Cambodia', 'Laos', 'Mongolia', 'North Korea', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Israel', 'Sri Lanka', 'Nepal', 'Bhutan', 'Maldives'];
                    return asianCountries.some(as => country === as || country.includes(as) || as.includes(country));
                  })
                  .filter(country => !countrySearch.trim() || 
                    country.toLowerCase().includes(countrySearch.toLowerCase()))
                  .map(country => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
              </optgroup>
              
              {/* Groupe Amériques */}
              <optgroup label={language === 'ar' ? '🌍 الأمريكتان' : '🌍 Americas'}>
                {filterOptions.countries
                  .filter(country => {
                    const americanCountries = ['United States', 'USA', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Uruguay', 'Paraguay', 'Ecuador', 'Venezuela', 'Bolivia', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panama', 'Cuba', 'Jamaica', 'Haiti', 'Dominican Republic', 'Trinidad', 'Barbados'];
                    return americanCountries.some(am => country === am || country.includes(am) || am.includes(country));
                  })
                  .filter(country => !countrySearch.trim() || 
                    country.toLowerCase().includes(countrySearch.toLowerCase()))
                  .map(country => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
              </optgroup>
              
              {/* Groupe Océanie */}
              <optgroup label={language === 'ar' ? '🌍 أوقيانوسيا' : '🌍 Oceania'}>
                {filterOptions.countries
                  .filter(country => {
                    const oceaniaCountries = ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Solomon Islands', 'Vanuatu'];
                    return oceaniaCountries.some(oc => country === oc || country.includes(oc) || oc.includes(country));
                  })
                  .filter(country => !countrySearch.trim() || 
                    country.toLowerCase().includes(countrySearch.toLowerCase()))
                  .map(country => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
              </optgroup>
            </select>
            {filters.country?.length > 0 && (
              <div className="selected-count">
                {filters.country.length} {language === 'ar' ? 'محدد' : 'selected'} / {filterOptions.countries.length}
              </div>
            )}
          </div>
        </div>

        {/* Bouton pour voir les résultats */}
        <div className="filters-footer">
          <button 
            className="view-results-btn"
            onClick={onClose}
          >
            {language === 'ar' ? `عرض ${filteredMatchesCount || matches.length} مباراة` : `View ${filteredMatchesCount || matches.length} matches`}
          </button>
          {activeFiltersCount > 0 && (
            <button 
              className="clear-all-btn-footer"
              onClick={clearAllFilters}
            >
              {language === 'ar' ? 'مسح الكل' : 'Clear all'}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

// Composant pour le bouton d'ouverture des filtres
export const FiltersButton = ({ onClick, activeFiltersCount }) => {
  const { language } = useTranslation();
  
  return (
    <button className="open-filters-btn" onClick={onClick}>
      {language === 'ar' ? '🔍 الفلاتر' : '🔍 Filters'}
      {activeFiltersCount > 0 && (
        <span className="filters-count-badge">{activeFiltersCount}</span>
      )}
    </button>
  );
};

export default AdvancedFilters;

