import { useRouter } from 'next/router';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import '../src/index.css';
import '../src/App.css';
import '../src/components/AllInOne.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const initialLang = pageProps.initialLang ?? router.query?.lang ?? (typeof window !== 'undefined' && typeof localStorage !== 'undefined' ? localStorage.getItem('app-language') : null) ?? 'ar';

  return (
    <LanguageProvider initialLanguage={initialLang}>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
