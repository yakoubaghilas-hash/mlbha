import React, { createContext, useContext, useState } from 'react';
import i18n from '@/src/i18n';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Never let initialization fail
  let initialLang = 'en';
  try {
    initialLang = i18n.locale || 'en';
  } catch {
    initialLang = 'en';
  }

  const [language, setLanguage] = useState<string>(initialLang);

  const changeLanguage = (lang: string) => {
    try {
      if (['en', 'fr', 'es'].includes(lang)) {
        i18n.locale = lang;
        setLanguage(lang);
      }
    } catch {
      // Silently ignore
    }
  };

  const t = (key: string) => {
    try {
      return i18n.t(key) || key;
    } catch {
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
