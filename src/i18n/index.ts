import { getLocales } from 'expo-localization';
import en from './en';
import fr from './fr';
import es from './es';

const translations: Record<string, any> = {
  en, fr, es,
};

// Simple i18n implementation
const i18n = {
  translations,
  defaultLocale: 'en',
  locale: getLocales()[0]?.languageCode || 'en',
  enableFallback: true,
  t: function(key: string): string {
    const currentLocale = this.translations[this.locale] || this.translations.en;
    return currentLocale[key] || this.translations.en[key] || key;
  },
};

export default i18n;
