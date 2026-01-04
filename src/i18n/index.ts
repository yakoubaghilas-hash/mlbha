import { getLocales } from 'expo-localization';
import en from './en';
import fr from './fr';
import es from './es';

const translations: Record<string, any> = {
  en, fr, es,
};

const locale = getLocales()[0]?.languageCode || 'en';

// Simple i18n implementation
const i18n = {
  translations,
  defaultLocale: 'en',
  locale,
  enableFallback: true,
  t: (key: string): string => {
    const currentLocale = translations[locale] || translations.en;
    return currentLocale[key] || translations.en[key] || key;
  },
};

export default i18n;
