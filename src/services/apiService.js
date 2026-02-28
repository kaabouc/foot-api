import axios from 'axios';

// Configuration de l'API
// Vous pouvez utiliser différentes APIs gratuites:
// 1. API-Football (RapidAPI) - RECOMMANDÉ: Plus de matchs, plus fiable (100 req/jour gratuit)
// 2. OpenLigaDB - Gratuit sans clé, mais principalement ligues allemandes
// 3. Football-Data.org - Gratuit mais limité (10 req/min)

// Option 1: API-Football via Dashboard (https://dashboard.api-football.com)
// Utilisez votre clé depuis le dashboard API-Football
const API_FOOTBALL_BASE_URL = 'https://v3.football.api-sports.io';
// Valeur directement dans le code - votre clé depuis le dashboard
const API_FOOTBALL_KEY = '1f864f16d2849e9f399d04930bff7ed3';

// Option 1b: OpenLigaDB (Gratuit, sans clé, mais principalement ligues allemandes)
const OPENLIGADB_BASE_URL = 'https://api.openligadb.de/getmatchdata';

// Option 2: Football-Data.org (gratuit, mais limité)
// En SSR (serveur Node) : pas de CORS → appel direct à l'API avec la clé.
// En navigateur (dev) : CORS → proxy sur port 3001. En production : appel direct.
const isDevelopment = process.env.NODE_ENV === 'development';
const USE_SEPARATE_PROXY = true;
const isServer = typeof window === 'undefined';

const FOOTBALL_DATA_BASE_URL = isServer
  ? 'https://api.football-data.org/v4'  // SSR : toujours direct (pas de CORS côté serveur)
  : (isDevelopment && USE_SEPARATE_PROXY
      ? 'http://localhost:3001/api/football-data/v4'  // Navigateur en dev : proxy
      : 'https://api.football-data.org/v4');  // Navigateur en prod : direct
// Valeur directement dans le code (depuis .env: REACT_APP_FOOTBALL_DATA_KEY est vide, donc on utilise la valeur par défaut)
const FOOTBALL_DATA_KEY = '48b3e12dda0a4f6eb0e983abe4388681';

// Debug: Vérifier les clés API (valeurs directement dans le code)
if (typeof window !== 'undefined') {
  console.log('=== 🔑 API Configuration Debug ===');
  console.log('📋 API-Football Key (RapidAPI):', API_FOOTBALL_KEY ? '✅ CONFIGURED' : '❌ NOT FOUND');
  if (API_FOOTBALL_KEY) {
    console.log('   Key length:', API_FOOTBALL_KEY.length);
    console.log('   Key preview:', API_FOOTBALL_KEY.substring(0, 15) + '...');
    console.log('   ⚠️  Values are hardcoded in code (not from .env)');
    console.log('   ⚠️  If you see 403 errors, this key may be invalid. Get a new one from RapidAPI.');
  }
  console.log('📋 Football-Data Key:', FOOTBALL_DATA_KEY ? '✅ CONFIGURED' : '❌ NOT FOUND');
  if (FOOTBALL_DATA_KEY) console.log('   Key length:', FOOTBALL_DATA_KEY.length);
  console.log('🌐 FOOTBALL_DATA_BASE_URL:', FOOTBALL_DATA_BASE_URL);
  console.log('🔧 USE_SEPARATE_PROXY:', USE_SEPARATE_PROXY, '(hardcoded)');
  console.log('================================');
  console.log('💡 Priority order: 1) API-Football (RapidAPI) → 2) Football-Data.org → 3) OpenLigaDB');
}

// Fonction pour formater la date en YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

// Fonction pour normaliser les noms de pays pour correspondre aux filtres
const normalizeCountryName = (country) => {
  if (!country) return null;
  
  // D'abord, remplacer les tirets par des espaces (API utilise souvent des tirets)
  let normalized = country.replace(/-/g, ' ').trim();
  
  // Map de normalisation pour les cas spéciaux
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
  
  // Vérifier si le pays (avec ou sans tirets) est dans la map
  if (countryMap[country]) {
    return countryMap[country];
  }
  if (countryMap[normalized]) {
    return countryMap[normalized];
  }
  
  // Retourner la version normalisée (sans tirets)
  return normalized;
};

// Fonction pour convertir les données de l'API au format de notre application
const transformApiMatch = (apiMatch, apiType = 'football-data') => {
  if (!apiMatch) {
    console.error('transformApiMatch: apiMatch is null or undefined');
    return null;
  }
  
  if (apiType === 'football-data') {
    try {
      // Format pour Football-Data.org
      if (!apiMatch.utcDate) {
        console.error('transformApiMatch: utcDate is missing', apiMatch);
        return null;
      }
      
      const matchDate = new Date(apiMatch.utcDate);
      
      // Vérifier que la date est valide
      if (isNaN(matchDate.getTime())) {
        console.error('transformApiMatch: Invalid date', apiMatch.utcDate);
        return null;
      }
      
      const hours = String(matchDate.getHours()).padStart(2, '0');
      const minutes = String(matchDate.getMinutes()).padStart(2, '0');
      
      const transformed = {
        id: apiMatch.id || `match-${Date.now()}-${Math.random()}`,
        date: formatDate(matchDate),
        time: `${hours}:${minutes}`,
        team1: {
          name: apiMatch.homeTeam?.name || 'Unknown Team',
          nameEn: apiMatch.homeTeam?.name || 'Unknown Team',
          logo: apiMatch.homeTeam?.crest || null
        },
        team2: {
          name: apiMatch.awayTeam?.name || 'Unknown Team',
          nameEn: apiMatch.awayTeam?.name || 'Unknown Team',
          logo: apiMatch.awayTeam?.crest || null
        },
        league: apiMatch.competition?.name || 'Unknown League',
        leagueEn: apiMatch.competition?.name || 'Unknown League',
        leagueLogo: apiMatch.competition?.emblem || null,
        country: normalizeCountryName(apiMatch.competition?.area?.name || apiMatch.area?.name || null),
        status: getMatchStatus(apiMatch.status),
        commentator: 'غير معروف',
        channel: 'غير معروف',
        score: {
          team1: apiMatch.score?.fullTime?.home ?? apiMatch.score?.home ?? 0,
          team2: apiMatch.score?.fullTime?.away ?? apiMatch.score?.away ?? 0
        },
        rawData: apiMatch
      };
      
      return transformed;
    } catch (error) {
      console.error('Error in transformApiMatch for football-data:', error);
      console.error('apiMatch:', apiMatch);
      return null;
    }
  } else if (apiType === 'api-football') {
    try {
      // Format pour API-Football (RapidAPI)
      if (!apiMatch.fixture || !apiMatch.fixture.date) {
        console.error('transformApiMatch: fixture.date is missing', apiMatch);
        return null;
      }
      
      const matchDate = new Date(apiMatch.fixture.date);
      
      // Vérifier que la date est valide
      if (isNaN(matchDate.getTime())) {
        console.error('transformApiMatch: Invalid date', apiMatch.fixture.date);
        return null;
      }
      
      const hours = String(matchDate.getHours()).padStart(2, '0');
      const minutes = String(matchDate.getMinutes()).padStart(2, '0');
      
      const transformed = {
        id: apiMatch.fixture.id || `api-football-${Date.now()}-${Math.random()}`,
        date: formatDate(matchDate),
        time: `${hours}:${minutes}`,
        team1: {
          name: apiMatch.teams?.home?.name || 'Unknown Team',
          nameEn: apiMatch.teams?.home?.name || 'Unknown Team',
          logo: apiMatch.teams?.home?.logo || null
        },
        team2: {
          name: apiMatch.teams?.away?.name || 'Unknown Team',
          nameEn: apiMatch.teams?.away?.name || 'Unknown Team',
          logo: apiMatch.teams?.away?.logo || null
        },
        league: apiMatch.league?.name || apiMatch.league?.country || 'Unknown League',
        leagueEn: apiMatch.league?.name || apiMatch.league?.country || 'Unknown League',
        leagueLogo: apiMatch.league?.logo || null,
        country: normalizeCountryName(apiMatch.league?.country) || null,
        status: getMatchStatus(apiMatch.fixture.status?.short || apiMatch.fixture.status?.long),
        commentator: 'غير معروف',
        channel: 'غير معروف',
        score: {
          team1: apiMatch.goals?.home ?? apiMatch.score?.fulltime?.home ?? 0,
          team2: apiMatch.goals?.away ?? apiMatch.score?.fulltime?.away ?? 0
        },
        rawData: apiMatch
      };
      
      return transformed;
    } catch (error) {
      console.error('Error in transformApiMatch for api-football:', error);
      console.error('apiMatch:', apiMatch);
      return null;
    }
  }
  return null;
};

// Fonction pour convertir le statut de l'API en statut de notre application
const getMatchStatus = (status) => {
  if (!status) return 'not_started';
  
  // Football-Data.org utilise des statuts comme: 'SCHEDULED', 'LIVE', 'IN_PLAY', 'PAUSED', 'FINISHED', etc.
  const statusUpper = status.toUpperCase();
  const statusLower = status.toLowerCase();
  
  if (statusUpper === 'FINISHED' || statusUpper === 'FT' || statusLower === 'finished') return 'finished';
  if (statusUpper === 'LIVE' || statusUpper === 'IN_PLAY' || statusUpper === 'PAUSED' || 
      statusLower === 'live' || statusLower === 'in_play' || statusLower === '1h' || statusLower === '2h') {
    return 'live';
  }
  return 'not_started';
};

// Récupérer les matchs depuis Football-Data.org
export const fetchMatchesFromFootballData = async (date) => {
  try {
    if (!FOOTBALL_DATA_KEY || FOOTBALL_DATA_KEY.trim() === '') {
      throw new Error('API key not configured. Please add REACT_APP_FOOTBALL_DATA_KEY to your .env file and restart the server');
    }

    console.log('Fetching matches from Football-Data.org for date:', date);
    console.log('API Key configured:', FOOTBALL_DATA_KEY ? 'Yes (length: ' + FOOTBALL_DATA_KEY.length + ')' : 'No');

    // Selon la documentation : https://www.football-data.org/documentation/quickstart
    // - /matches sans paramètres = matchs d'aujourd'hui
    // - /matches?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD = matchs dans la plage de dates
    
    // En SSR ou en production : appel direct → on envoie la clé. En dev navigateur avec proxy : le proxy ajoute la clé.
    const useDirectApi = isServer || (!isDevelopment || !USE_SEPARATE_PROXY);
    const headers = useDirectApi
      ? { 'X-Auth-Token': FOOTBALL_DATA_KEY, 'Accept': 'application/json' }
      : {};

    // Selon la doc : /matches sans params = aujourd'hui, /matches?dateFrom=X&dateTo=Y = plage
    const todayDate = formatDate(new Date());
    const url = `${FOOTBALL_DATA_BASE_URL}/matches`;
    let params = {};
    if (date !== todayDate) {
      params = { dateFrom: date, dateTo: date };
    }
    console.log('🌐 Request URL:', url);
    console.log('🔑 Football-Data:', isServer ? 'Direct (SSR)' : (isDevelopment && USE_SEPARATE_PROXY ? 'Proxy' : 'Direct'));
    console.log('📤 Params:', Object.keys(params).length ? params : '(today - no params)');
    
    const response = await axios.get(url, {
      params: params,
      headers: headers,
      timeout: 10000  // 10 secondes timeout
    }).catch(error => {
      if (error.code === 'ECONNREFUSED' && USE_SEPARATE_PROXY) {
        console.error('❌ Connection refused to proxy server at http://localhost:3001');
        console.error('❌ Make sure the proxy server is running: npm run proxy');
        throw new Error('Proxy server not running. Please run "npm run proxy" in a separate terminal.');
      }
      throw error;
    });

    console.log('✅ API Response status:', response.status);
    console.log('📦 API Response data keys:', Object.keys(response.data || {}));
    console.log('📋 Full API Response:', JSON.stringify(response.data, null, 2));

    if (response.data) {
      // Football-Data.org retourne les matchs dans response.data.matches
      let matches = response.data.matches || [];
      console.log('📊 Raw matches count from API:', matches.length);
      
      // Si c'est pour aujourd'hui et qu'on a utilisé /matches sans params,
      // l'API devrait déjà filtrer, mais on filtre quand même côté client pour sécurité
      if (date === todayDate && matches.length > 0) {
        const targetDate = date;
        const originalCount = matches.length;
        matches = matches.filter(match => {
          if (!match.utcDate) {
            console.warn('Match without utcDate:', match);
            return false;
          }
          try {
            const matchDate = formatDate(new Date(match.utcDate));
            return matchDate === targetDate;
          } catch (e) {
            console.warn('Error parsing match date:', match.utcDate, e);
            return false;
          }
        });
        if (originalCount !== matches.length) {
          console.log(`🔍 Filtered ${originalCount} matches to ${matches.length} for date ${date}`);
        }
      }
      
      console.log('📊 Extracted matches array:', matches);
      console.log('✓ Matches is array?', Array.isArray(matches));
      console.log('📊 Matches length:', matches.length);
      
      if (response.data.resultSet) {
        console.log('📊 ResultSet info:', {
          count: response.data.resultSet.count,
          first: response.data.resultSet.first,
          last: response.data.resultSet.last,
          played: response.data.resultSet.played
        });
      }
      
      if (response.data.filters) {
        console.log('🔍 Filters applied:', response.data.filters);
        console.log('🔍 Permission level:', response.data.filters.permission || 'Unknown');
        console.log('🔍 Competitions:', response.data.filters.competitions || 'All subscribed');
      }
      
      // Vérifier le resultSet pour plus d'infos
      if (response.data.resultSet) {
        console.log('📊 ResultSet details:', {
          count: response.data.resultSet.count,
          first: response.data.resultSet.first,
          last: response.data.resultSet.last,
          played: response.data.resultSet.played,
          competitions: response.data.resultSet.competitions
        });
        
        // Si resultSet.count est 0, on sait qu'il n'y a vraiment pas de matchs
        if (response.data.resultSet.count === 0) {
          console.log(`ℹ️ resultSet.count = 0 - No matches available for subscribed competitions on ${date}`);
          console.log(`ℹ️ Your plan (${response.data.filters?.permission || 'TIER_THREE'}) may have limited competition access`);
        }
      }
      
      if (Array.isArray(matches)) {
        if (matches.length > 0) {
          console.log(`✅ Found ${matches.length} match(es) in matches array for date: ${date}`);
          console.log('📋 First match sample:', JSON.stringify(matches[0], null, 2));
          
          try {
            const transformedMatches = matches.map((match, index) => {
              try {
                const transformed = transformApiMatch(match, 'football-data');
                if (transformed) {
                  console.log(`✓ Match ${index + 1}/${matches.length} transformed: ${transformed.team1.name} vs ${transformed.team2.name}`);
                  return transformed;
                }
                console.warn(`✗ Match ${index + 1} transformation returned null`);
                console.warn('Match data that failed:', JSON.stringify(match, null, 2));
                return null;
              } catch (transformError) {
                console.error(`✗ Error transforming match ${index + 1}:`, transformError.message);
                console.error('Match data:', JSON.stringify(match, null, 2));
                return null;
              }
            }).filter(m => m !== null); // Filtrer les null en cas d'erreur
            
            console.log(`✅ Successfully transformed ${transformedMatches.length}/${matches.length} match(es)`);
            
            if (transformedMatches.length === 0 && matches.length > 0) {
              console.error('❌ ERROR: All matches failed transformation!');
              console.error('This means the transform function has a bug or the API format changed.');
              console.error('Sample match structure:', JSON.stringify(matches[0], null, 2));
              console.error('Please check the transformApiMatch function for "football-data" type.');
            }
            
            return transformedMatches;
          } catch (error) {
            console.error('✗ Error in transformation:', error);
            console.error('Error stack:', error.stack);
            return [];
          }
        } else {
          // Pas de matchs dans le tableau matches
          console.log(`ℹ️ matches array is empty for date: ${date}`);
          console.log('ℹ️ This could mean:');
          console.log('   1. No matches scheduled for this date in your subscribed competitions');
          console.log('   2. Your plan (TIER_THREE) has limited access to competitions');
          console.log('   3. The date is outside the current season');
          console.log('Response info:', {
            filters: response.data.filters,
            resultSet: response.data.resultSet,
            matchesLength: matches.length
          });
          return []; // Retourner un tableau vide, pas une erreur
        }
      } else {
        console.error('❌ ERROR: matches is not an array!');
        console.error('matches type:', typeof matches);
        console.error('matches value:', matches);
      }
      
      console.warn('⚠️ Unexpected response format - matches is not an array:', response.data);
      return [];
    }
    
    console.warn('⚠️ No data in response');
    return [];
  } catch (error) {
    console.error('Error fetching matches from Football-Data.org:', error);
    // Afficher plus de détails sur l'erreur
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
      
      // Messages d'erreur plus explicites
      if (error.response.status === 403 || error.response.status === 401) {
        throw new Error('Erreur d\'authentification API. Vérifiez votre clé API dans le fichier .env');
      } else if (error.response.status === 429) {
        throw new Error('Limite de requêtes API atteinte. Veuillez patienter quelques minutes.');
      } else if (error.response.status >= 500) {
        throw new Error('Erreur serveur API. Veuillez réessayer plus tard.');
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('Aucune réponse de l\'API. Vérifiez votre connexion internet.');
    }
    throw error;
  }
};

// Récupérer les matchs depuis API-Football (RapidAPI)
export const fetchMatchesFromApiFootball = async (date) => {
  try {
    if (!API_FOOTBALL_KEY || API_FOOTBALL_KEY.trim() === '') {
      throw new Error('API key not configured. Please add REACT_APP_API_FOOTBALL_KEY to your .env file and restart the server');
    }

    console.log('Fetching matches from API-Football for date:', date);
    console.log('API-Football Key configured:', API_FOOTBALL_KEY ? 'Yes (length: ' + API_FOOTBALL_KEY.length + ')' : 'No');

    console.log('🌐 API-Football Request URL:', `${API_FOOTBALL_BASE_URL}/fixtures`);
    console.log('📅 API-Football Request date:', date);
    console.log('🔑 API-Football Key (first 10 chars):', API_FOOTBALL_KEY.substring(0, 10) + '...');
    
    const response = await axios.get(`${API_FOOTBALL_BASE_URL}/fixtures`, {
      params: {
        date: date
      },
      headers: {
        'X-RapidAPI-Key': API_FOOTBALL_KEY
        // Plus besoin de X-RapidAPI-Host pour le dashboard
      },
      timeout: 15000  // 15 secondes timeout
    }).catch(error => {
      console.error('❌ API-Football Request Error:', error.message);
      if (error.response) {
        console.error('❌ API-Football Response status:', error.response.status);
        console.error('❌ API-Football Response data:', error.response.data);
        if (error.response.status === 401 || error.response.status === 403) {
          console.error('❌ API-Football: Invalid API key or unauthorized');
        } else if (error.response.status === 429) {
          console.error('❌ API-Football: Rate limit exceeded');
        }
      } else if (error.request) {
        console.error('❌ API-Football: No response received (CORS or network issue)');
      }
      throw error;
    });

    console.log('✅ API-Football Response status:', response.status);
    console.log('📦 API-Football Response data keys:', Object.keys(response.data || {}));
    console.log('📋 API-Football Response data:', response.data);

    if (response.data) {
      // If API returns an error message (e.g. account suspended), treat as no data and try next API
      const apiErrors = response.data.errors;
      if (apiErrors && typeof apiErrors === 'object') {
        const msg = apiErrors.access || apiErrors.token || apiErrors[Object.keys(apiErrors)[0]];
        if (msg) {
          console.warn('⚠️ API-Football returned error:', msg);
          console.warn('💡 Check https://dashboard.api-football.com if your account is suspended or key is invalid.');
          return [];
        }
      }
      let matches = response.data.response || [];
      console.log('API-Football matches array:', matches);
      console.log('API-Football matches length:', matches.length);
      
      if (Array.isArray(matches)) {
        if (matches.length > 0) {
          console.log(`Found ${matches.length} match(es) from API-Football for date: ${date}`);
          console.log('First match sample:', matches[0]);
          
          try {
            const transformedMatches = matches.map((match, index) => {
              try {
                const transformed = transformApiMatch(match, 'api-football');
                if (transformed) {
                  return transformed;
                }
                console.warn(`Match ${index + 1} transformation returned null`);
                return null;
              } catch (transformError) {
                console.error(`Error transforming match ${index + 1}:`, transformError);
                console.error('Match data:', match);
                return null;
              }
            }).filter(m => m !== null);
            
            console.log(`Successfully transformed ${transformedMatches.length} match(es) from API-Football`);
            return transformedMatches;
          } catch (error) {
            console.error('Error in transformation:', error);
            return [];
          }
        } else {
          console.log(`No matches found from API-Football for date: ${date} (this is normal, not an error)`);
          return [];
        }
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching matches from API-Football:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
      
      if (error.response.status === 403 || error.response.status === 401) {
        const errorMsg = error.response.data?.message || 'Erreur d\'authentification';
        console.error('❌ API-Football authentication failed:', errorMsg);
        console.error('💡 This usually means the API key is invalid or not subscribed');
        console.error('💡 The app will try Football-Data.org instead...');
        throw new Error(`API-Football: ${errorMsg} (will try alternatives)`);
      } else if (error.response.status === 429) {
        throw new Error('Limite de requêtes API-Football atteinte (100/jour). Veuillez patienter.');
      }
    } else if (error.request) {
      console.error('No response received from API-Football:', error.request);
      throw new Error('Aucune réponse de l\'API-Football. Vérifiez votre connexion internet.');
    }
    throw error;
  }
};

// Récupérer les matchs depuis OpenLigaDB (gratuit, sans clé, mais limité aux ligues allemandes)
export const fetchMatchesFromOpenLigaDB = async (date) => {
  try {
    console.log('Fetching matches from OpenLigaDB for date:', date);
    
    // OpenLigaDB - Utiliser l'endpoint pour obtenir les matchs par date
    // L'API OpenLigaDB est gratuite mais limitée aux compétitions allemandes
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    // Essayer différents endpoints OpenLigaDB
    let response;
    let matches = [];
    
    try {
      // Essayer l'endpoint avec date et ligue
      const url = `https://api.openligadb.de/getmatchdata/${encodeURIComponent(year)}/${encodeURIComponent(month)}/${encodeURIComponent(day)}`;
      console.log('🌐 OpenLigaDB URL:', url);
      
      response = await axios.get(url, {
        timeout: 10000
      });
      
      console.log('✅ OpenLigaDB Response status:', response.status);
      
      if (response.data && Array.isArray(response.data)) {
        matches = response.data;
        console.log(`📊 OpenLigaDB found ${matches.length} match(es) for date ${date}`);
      } else {
        console.log('ℹ️ OpenLigaDB returned no matches for this date');
        return [];
      }
    } catch (dateError) {
      console.warn('⚠️ OpenLigaDB date endpoint failed, trying league endpoint:', dateError.message);
      
      // Fallback : Essayer avec ligue (Bundesliga 1)
      try {
        const leagueUrl = `https://api.openligadb.de/getmatchdata/bl1/${year}`;
        console.log('🌐 OpenLigaDB League URL:', leagueUrl);
        
        response = await axios.get(leagueUrl, {
          timeout: 10000
        });
        
        if (response.data && Array.isArray(response.data)) {
          // Filtrer par date
          matches = response.data.filter(match => {
            if (!match.matchDateTime) return false;
            const matchDate = new Date(match.matchDateTime).toISOString().split('T')[0];
            return matchDate === date;
          });
          console.log(`📊 OpenLigaDB found ${matches.length} match(es) for date ${date} after filtering`);
        }
      } catch (leagueError) {
        console.error('❌ OpenLigaDB league endpoint also failed:', leagueError.message);
        throw new Error('OpenLigaDB endpoints not available');
      }
    }
    
    if (matches.length === 0) {
      console.log('ℹ️ OpenLigaDB: No matches found for this date');
      return [];
    }

    const transformed = matches.map(match => ({
      id: match.matchID || `openliga-${Date.now()}-${Math.random()}`,
      date: date,
      time: match.matchDateTime ? new Date(match.matchDateTime).toTimeString().slice(0, 5) : '00:00',
      team1: {
        name: match.team1?.teamName || 'Unknown Team',
        nameEn: match.team1?.teamName || 'Unknown Team',
        logo: match.team1?.teamIconUrl || null
      },
      team2: {
        name: match.team2?.teamName || 'Unknown Team',
        nameEn: match.team2?.teamName || 'Unknown Team',
        logo: match.team2?.teamIconUrl || null
      },
      league: match.leagueName || match.leagueShortcut || 'Bundesliga',
      leagueEn: match.leagueName || match.leagueShortcut || 'Bundesliga',
      status: match.matchIsFinished ? 'finished' : (match.matchIsLive ? 'live' : 'not_started'),
      commentator: 'غير معروف',
      channel: 'غير معروف',
      score: {
        team1: match.matchResults?.[0]?.pointsTeam1 ?? match.matchResults?.[1]?.pointsTeam1 ?? 0,
        team2: match.matchResults?.[0]?.pointsTeam2 ?? match.matchResults?.[1]?.pointsTeam2 ?? 0
      },
      rawData: match
    }));
    
    console.log(`✅ OpenLigaDB transformed ${transformed.length} match(es) for date ${date}`);
    return transformed;
  } catch (error) {
    console.error('❌ Error fetching matches from OpenLigaDB:', error.message);
    // Ne pas throw, juste retourner [] pour permettre aux autres APIs de s'essayer
    return [];
  }
};

// Fonction principale pour récupérer les matchs (essaie plusieurs sources)
export const fetchMatches = async (date) => {
  console.log('🚀 ========== STARTING MATCH FETCH ==========');
  console.log('📅 Target date:', date);
  console.log('🔑 API-Football key available:', !!API_FOOTBALL_KEY);
  console.log('🔑 Football-Data key available:', !!FOOTBALL_DATA_KEY);
  
  try {
    // PRIORITÉ 1: API-Football (RECOMMANDÉ - Plus fiable, plus de matchs)
    if (API_FOOTBALL_KEY && API_FOOTBALL_KEY.trim() !== '') {
      console.log('🎯 Trying API-Football first (PRIORITY 1)...');
      try {
        const matches = await fetchMatchesFromApiFootball(date);
        if (matches && Array.isArray(matches)) {
          console.log('✅✅✅ API-Football SUCCESS! Returned', matches.length, 'match(es)');
          if (matches.length > 0) {
            console.log('🎉 Using API-Football results - matches found!');
            return matches;
          } else {
            console.log('ℹ️ API-Football returned empty array (no matches for this date)');
            // Continue to try other APIs even if empty
          }
        } else {
          console.warn('⚠️ API-Football returned invalid data (not an array)');
        }
      } catch (error) {
        console.error('❌ API-Football ERROR:', error.message);
        if (error.response) {
          if (error.response.status === 403 || error.response.status === 401) {
            console.error('🚨 API-Football: 403 Forbidden - Your API key is INVALID or NOT SUBSCRIBED');
            console.error('💡 Solution: Get a valid key from https://rapidapi.com/api-sports/api/api-football');
            console.error('   1. Subscribe to "Basic" plan (free - 100 req/day)');
            console.error('   2. Copy your key from Security → Application Key');
            console.error('   3. Update REACT_APP_API_FOOTBALL_KEY in .env');
            console.error('   4. Restart React server');
          } else if (error.response.status === 429) {
            console.error('🚨 API-Football: Rate limit exceeded (100 req/day used)');
            console.error('💡 Wait until tomorrow or use Football-Data.org as backup');
          }
        }
        console.warn('⚠️ API-Football failed, trying alternatives...');
        // Continue to next API
      }
    } else {
      console.log('⚠️ API-Football key not configured, skipping...');
    }

    // PRIORITÉ 2: Football-Data.org
    if (FOOTBALL_DATA_KEY && FOOTBALL_DATA_KEY.trim() !== '') {
      console.log('🎯 Trying Football-Data.org (PRIORITY 2)...');
      try {
        const matches = await fetchMatchesFromFootballData(date);
        if (matches && Array.isArray(matches)) {
          console.log('✅✅✅ Football-Data.org SUCCESS! Returned', matches.length, 'match(es)');
          if (matches.length > 0) {
            console.log('🎉 Using Football-Data.org results - matches found!');
            return matches;
          } else {
            console.log('ℹ️ Football-Data.org returned empty array (no matches for this date)');
            // Continue to try other APIs even if empty
          }
        } else {
          console.warn('⚠️ Football-Data.org returned invalid data (not an array)');
        }
      } catch (error) {
        console.error('❌ Football-Data.org ERROR:', error.message);
        console.warn('⚠️ Football-Data.org failed, trying OpenLigaDB...');
      }
    } else {
      console.log('⚠️ Football-Data.org key not configured, skipping...');
    }

    // PRIORITÉ 3: OpenLigaDB (Gratuit, sans clé, mais limité aux ligues allemandes)
    console.log('🎯 Trying OpenLigaDB (PRIORITY 3 - fallback)...');
    try {
      const matches = await fetchMatchesFromOpenLigaDB(date);
      if (matches && Array.isArray(matches)) {
        console.log('✅✅✅ OpenLigaDB SUCCESS! Returned', matches.length, 'match(es)');
        if (matches.length > 0) {
          console.log('🎉 Using OpenLigaDB results - matches found!');
          return matches;
        } else {
          console.log('ℹ️ OpenLigaDB returned empty array (no matches for this date)');
        }
      }
    } catch (error) {
      console.error('❌ OpenLigaDB ERROR:', error.message);
      console.warn('⚠️ OpenLigaDB failed');
    }

    // Si aucune API n'est configurée ou fonctionne
    if (!API_FOOTBALL_KEY && !FOOTBALL_DATA_KEY) {
      console.warn('⚠️ No API keys configured. Add REACT_APP_API_FOOTBALL_KEY to .env');
      console.info('💡 Tip: Get free API key at https://rapidapi.com/api-sports/api/api-football');
    }
    
    console.log('❌❌❌ ALL APIs returned empty or failed. No matches found for date:', date);
    console.log('🚀 ========== END MATCH FETCH ==========');
    return [];
  } catch (error) {
    console.error('❌❌❌ FATAL ERROR in fetchMatches:', error);
    console.error('Error stack:', error.stack);
    console.log('🚀 ========== END MATCH FETCH (ERROR) ==========');
    return [];
  }
};

// Fonction pour obtenir les matchs d'aujourd'hui
export const fetchTodayMatches = async () => {
  const today = formatDate(new Date());
  return await fetchMatches(today);
};

export const fetchYesterdayMatches = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return await fetchMatches(formatDate(yesterday));
};

export const fetchTomorrowMatches = async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return await fetchMatches(formatDate(tomorrow));
};

