// Sistema di traduzione semplice per React
import { createContext, useContext, useState, useEffect } from 'react';
import { SmartFlag } from '../components/FlagIcons';

// Importa le traduzioni
import itTranslations from './it.json';
import esTranslations from './es.json';
import enTranslations from './en.json';

const translations = {
  it: itTranslations,
  es: esTranslations,
  en: enTranslations
};

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage deve essere usato all\'interno di LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Lingua di default: spagnolo
  const [language, setLanguage] = useState('es');
  const [isLoading, setIsLoading] = useState(false);

  // Carica la lingua salvata dal localStorage al mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('adagio-language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Salva la lingua nel localStorage quando cambia
  useEffect(() => {
    localStorage.setItem('adagio-language', language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setIsLoading(true);
      setLanguage(newLanguage);
      // Simula un breve caricamento per l'animazione
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let translation = translations[language];
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        // Fallback alla lingua italiana se la chiave non esiste
        translation = translations.it;
        for (const fallbackKey of keys) {
          if (translation && translation[fallbackKey]) {
            translation = translation[fallbackKey];
          } else {
            return key; // Ritorna la chiave se non trova la traduzione
          }
        }
        break;
      }
    }

    // Sostituisce i parametri se presenti
    if (typeof translation === 'string' && Object.keys(params).length > 0) {
      return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] || match;
      });
    }

    return translation || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    isLoading,
    availableLanguages: [
      { code: 'es', name: 'Español', flag: <SmartFlag country="es" className="w-6 h-4" /> },
      { code: 'en', name: 'English', flag: <SmartFlag country="en" className="w-6 h-4" /> },
      { code: 'it', name: 'Italiano', flag: <SmartFlag country="it" className="w-6 h-4" /> }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
