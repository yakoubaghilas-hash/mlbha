import React, { createContext, useContext, useState } from 'react';
import i18n from '@/src/i18n';
import { safeSync } from '@/src/utils/safeInitialization';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>(
    safeSync(
      () => i18n.locale,
      'en'
    )
  );

  const changeLanguage = (lang: string) => {
    try {
      i18n.locale = lang;
      setLanguage(lang);
    } catch (error) {
      // Fail silently, keep current language
    }
  };

  const t = (key: string) => {
    return safeSync(
      () => i18n.t(key),
      key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
