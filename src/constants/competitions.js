// Shared list of allowed competitions (used in App and SSR)
export const ALLOWED_COMPETITIONS = [
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

export const isAllowedCompetition = (leagueName) => {
  if (!leagueName) return false;
  const leagueLower = leagueName.toLowerCase();
  return ALLOWED_COMPETITIONS.some(allowed =>
    leagueLower === allowed.toLowerCase() ||
    leagueLower.includes(allowed.toLowerCase()) ||
    allowed.toLowerCase().includes(leagueLower)
  );
};
