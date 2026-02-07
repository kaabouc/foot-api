// Service de cache pour optimiser l'utilisation de l'API (100 req/jour)
// Les données sont mises en cache et mises à jour toutes les 45 minutes

const CACHE_KEY_PREFIX = 'football_matches_cache_';
const CACHE_UPDATE_INTERVAL = 45 * 60 * 1000; // 45 minutes en millisecondes
const API_UPDATE_INTERVAL = 30 * 60 * 1000; // 30 minutes pour l'API

// Obtenir le timezone du serveur/navigateur
export const getServerTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

// Obtenir la date actuelle dans le timezone du serveur
export const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Obtenir la date d'hier
export const getYesterdayDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Obtenir la date de demain
export const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Obtenir la clé de cache pour une date
const getCacheKey = (date) => {
  return `${CACHE_KEY_PREFIX}${date}`;
};

// Obtenir les données en cache pour une date
export const getCachedMatches = (date) => {
  try {
    const cacheKey = getCacheKey(date);
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }
    
    const parsed = JSON.parse(cached);
    const now = Date.now();
    
    // Vérifier si le cache est encore valide (moins de 45 minutes)
    if (now - parsed.timestamp < CACHE_UPDATE_INTERVAL) {
      return parsed.data;
    }
    
    // Cache expiré
    return null;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
};

// Sauvegarder les données en cache pour une date (SSR-safe)
export const setCachedMatches = (date, data) => {
  if (typeof window === 'undefined') return;
  try {
    const cacheKey = getCacheKey(date);
    const cacheData = {
      data: data,
      timestamp: Date.now(),
      date: date
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log(`✅ Cache saved for date: ${date}`);
  } catch (error) {
    console.error('Error saving cache:', error);
  }
};

// Vérifier si le cache doit être mis à jour (SSR-safe)
export const shouldUpdateCache = (date) => {
  if (typeof window === 'undefined') return true;
  try {
    const cacheKey = getCacheKey(date);
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      return true; // Pas de cache, doit être mis à jour
    }
    
    const parsed = JSON.parse(cached);
    const now = Date.now();
    
    // Mettre à jour si le cache a plus de 45 minutes
    return (now - parsed.timestamp) >= CACHE_UPDATE_INTERVAL;
  } catch (error) {
    console.error('Error checking cache:', error);
    return true;
  }
};

// Obtenir toutes les dates (hier, aujourd'hui, demain)
export const getAllDates = () => {
  return {
    yesterday: getYesterdayDate(),
    today: getCurrentDate(),
    tomorrow: getTomorrowDate(),
    timezone: getServerTimezone()
  };
};

// Initialiser le cache avec les dates
export const initializeCache = () => {
  const dates = getAllDates();
  console.log('🌍 Server Timezone:', dates.timezone);
  console.log('📅 Dates:', dates);
  
  return dates;
};

// Obtenir les matchs depuis le cache ou l'API
export const getMatchesWithCache = async (date, fetchFunction) => {
  // D'abord, essayer de récupérer depuis le cache
  const cached = getCachedMatches(date);
  
  if (cached && !shouldUpdateCache(date)) {
    console.log(`📦 Using cached data for ${date}`);
    return cached;
  }
  
  // Cache expiré ou inexistant, récupérer depuis l'API
  console.log(`🌐 Fetching fresh data from API for ${date}`);
  try {
    const data = await fetchFunction(date);
    setCachedMatches(date, data);
    return data;
  } catch (error) {
    console.error('Error fetching from API:', error);
    
    // En cas d'erreur, utiliser le cache même s'il est expiré
    if (cached) {
      console.log(`⚠️ Using expired cache due to API error for ${date}`);
      return cached;
    }
    
    throw error;
  }
};

// Nettoyer les anciens caches (SSR-safe)
export const cleanOldCache = () => {
  if (typeof window === 'undefined') return;
  try {
    const dates = getAllDates();
    const validDates = [dates.yesterday, dates.today, dates.tomorrow];
    
    // Parcourir tous les éléments du localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_KEY_PREFIX)) {
        const date = key.replace(CACHE_KEY_PREFIX, '');
        if (!validDates.includes(date)) {
          keysToRemove.push(key);
        }
      }
    }
    
    // Supprimer les anciens caches
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🗑️ Removed old cache: ${key}`);
    });
    
    if (keysToRemove.length > 0) {
      console.log(`🧹 Cleaned ${keysToRemove.length} old cache entries`);
    }
  } catch (error) {
    console.error('Error cleaning cache:', error);
  }
};

// Mettre à jour toutes les dates en cache (appelé toutes les 30 minutes)
export const updateAllCaches = async (fetchYesterday, fetchToday, fetchTomorrow) => {
  const dates = getAllDates();
  
  console.log('🔄 Updating all caches...');
  
  try {
    // Mettre à jour hier
    if (shouldUpdateCache(dates.yesterday)) {
      console.log(`📥 Fetching yesterday (${dates.yesterday})...`);
      const yesterdayData = await fetchYesterday();
      setCachedMatches(dates.yesterday, yesterdayData);
    }
    
    // Mettre à jour aujourd'hui
    if (shouldUpdateCache(dates.today)) {
      console.log(`📥 Fetching today (${dates.today})...`);
      const todayData = await fetchToday();
      setCachedMatches(dates.today, todayData);
    }
    
    // Mettre à jour demain
    if (shouldUpdateCache(dates.tomorrow)) {
      console.log(`📥 Fetching tomorrow (${dates.tomorrow})...`);
      const tomorrowData = await fetchTomorrow();
      setCachedMatches(dates.tomorrow, tomorrowData);
    }
    
    // Nettoyer les anciens caches
    cleanOldCache();
    
    console.log('✅ All caches updated');
  } catch (error) {
    console.error('❌ Error updating caches:', error);
  }
};

// Démarrer le système de cache automatique
export const startCacheAutoUpdate = (fetchYesterday, fetchToday, fetchTomorrow) => {
  console.log('🚀 Starting cache auto-update system...');
  
  // Mettre à jour immédiatement
  updateAllCaches(fetchYesterday, fetchToday, fetchTomorrow);
  
  // Mettre à jour toutes les 30 minutes
  const intervalId = setInterval(() => {
    updateAllCaches(fetchYesterday, fetchToday, fetchTomorrow);
  }, API_UPDATE_INTERVAL);
  
  // Nettoyer les anciens caches toutes les heures
  setInterval(() => {
    cleanOldCache();
  }, 60 * 60 * 1000);
  
  return intervalId;
};

