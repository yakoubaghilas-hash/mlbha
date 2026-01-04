import React, { createContext, useContext, useState } from 'react';
import i18n from '@/src/i18n';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => void;
  t: (key: string, options?: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>(i18n.locale);

  const changeLanguage = (lang: string) => {
    i18n.locale = lang;
    setLanguage(lang);
  };

  const t = (key: string, options?: any) => {
    return i18n.t(key, options);
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
