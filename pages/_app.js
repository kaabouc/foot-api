import { useRouter } from 'next/router';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import '../src/index.css';
import '../src/App.css';
// Global CSS from components (Next.js requires first-party global CSS in _app.js)
import '../src/components/Header.css';
import '../src/components/FilterButtons.css';
import '../src/components/MatchList.css';
import '../src/components/MatchCard.css';
import '../src/components/AdvancedFilters.css';
import '../src/components/Pagination.css';
import '../src/components/SearchAndFilter.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const initialLang = pageProps.initialLang ?? router.query?.lang ?? (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('app-language') : null) ?? 'ar';

  return (
    <LanguageProvider initialLanguage={initialLang}>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
