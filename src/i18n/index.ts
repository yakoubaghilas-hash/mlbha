// Minimal i18n implementation with zero error risk
let translations: Record<string, any> = {
  en: require('./en').default || {},
  fr: require('./fr').default || {},
  es: require('./es').default || {},
};

// Safe locale detection
let currentLocale = 'en';
try {
  // Only try to get locales if available
  const { getLocales } = require('expo-localization');
  if (getLocales && typeof getLocales === 'function') {
    const locales = getLocales();
    if (Array.isArray(locales) && locales.length > 0) {
      const detected = locales[0]?.languageCode;
      if (detected && ['en', 'fr', 'es'].includes(detected)) {
        currentLocale = detected;
      }
    }
  }
} catch (error) {
  // Silently fail - use default English
  currentLocale = 'en';
}

const i18n = {
  translations,
  defaultLocale: 'en',
  locale: currentLocale,
  enableFallback: true,
  t: function(key: string): string {
    try {
      const current = this.translations[this.locale];
      if (current && current[key]) {
        return current[key];
      }
      const fallback = this.translations.en;
      if (fallback && fallback[key]) {
        return fallback[key];
      }
      return key;
    } catch (error) {
      return key;
    }
  },
};

export default i18n;
