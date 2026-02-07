// Canonical site URL - single source of truth for SEO
export const SITE_URL = 'https://koora.marocaine.org';

// Brand
export const SITE_NAME = 'Koora for the World';
export const SITE_NAME_AR = 'كورة للعالم';

// Senior-level SEO: primary and long-tail keywords (Arabic, French, English)
export const SEO_KEYWORDS = [
  // Core brand
  'koora for the world',
  'كورة للعالم',
  'koora maroc',
  // Live scores & results
  'live football scores',
  'live soccer scores',
  'نتائج المباريات مباشرة',
  'مباريات اليوم',
  'résultats foot en direct',
  'scores football en direct',
  'today football matches',
  'yesterday match results',
  'tomorrow football fixtures',
  // Leagues (global)
  'Champions League',
  'دوري أبطال أوروبا',
  'Premier League',
  'الدوري الإنجليزي',
  'La Liga',
  'الدوري الإسباني',
  'Serie A',
  'Bundesliga',
  'Ligue 1',
  'UEFA Europa League',
  'Conference League',
  // Morocco & MENA
  'Botola',
  'البطولة المغربية',
  'الدوري المغربي',
  'Morocco football',
  'football maroc',
  'كورة مغربية',
  'Algerian Ligue 1',
  'Tunisian Ligue 1',
  'Saudi Pro League',
  // International
  'World Cup',
  'Africa Cup of Nations',
  'AFCON',
  'Euro',
  'Copa America',
  'Gold Cup',
  'Asian Cup',
  // Intent
  'football live score',
  'match en direct',
  'متابعة المباريات',
  'calendrier match foot',
  'fixtures today',
  'live score app',
].join(', ');

// Default meta (used in _document and overridden per page)
export const DEFAULT_META = {
  title: 'Koora for the World | Live Football Scores & Today Matches',
  titleAr: 'كورة للعالم | نتائج المباريات مباشرة ومباريات اليوم',
  description: 'Live football scores and today\'s matches from around the world. Premier League, La Liga, Champions League, Botola, and more. كورة للعالم - نتائج مباشرة.',
  descriptionAr: 'نتائج المباريات مباشرة ومباريات اليوم من كل أنحاء العالم. الدوري الإنجليزي، الإسباني، دوري أبطال أوروبا، البطولة والمزيد.',
  ogImage: `${SITE_URL}/og-image.jpg`,
};
