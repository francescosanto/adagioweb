import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../translations';

const LanguageSelector = () => {
  const { language, changeLanguage, availableLanguages, isLoading } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = availableLanguages.find(lang => lang.code === language);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-adagio-cream/20 hover:bg-adagio-cream/30 text-adagio-black transition-all duration-300 border border-adagio-black/20 hover:border-adagio-green"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
      >
                 <span className="text-sm font-medium hidden sm:inline flex items-center gap-2">
          {currentLanguage?.flag}
        </span>
        <span className="text-sm font-medium sm:hidden">
          {currentLanguage?.flag}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-48 bg-adagio-cream rounded-lg shadow-xl border border-adagio-black/20 z-50 overflow-hidden"
          >
            {availableLanguages.map((lang) => (
                             <motion.button
                 key={lang.code}
                 onClick={() => handleLanguageChange(lang.code)}
                 className={`w-full px-4 py-3 text-left hover:bg-adagio-green hover:text-adagio-cream transition-colors duration-200 flex items-center gap-3 ${
                   language === lang.code ? 'bg-adagio-green text-adagio-cream' : 'text-adagio-black'
                 }`}
                 disabled={isLoading}
               >
                                 <div className="flex-shrink-0">{lang.flag}</div>
                <span className="font-medium">{lang.name}</span>
                {language === lang.code && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-2 h-2 bg-adagio-cream rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay per chiudere il menu quando si clicca fuori */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSelector;
